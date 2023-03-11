import { h } from './preact';
import { useEffect, useState, useCallback, useRef } from './preactHooks'
import { ConnectingScreen } from './components/ConnectingScreen';
import { MessageFeed } from './components/MessageFeed';
import { ChatBox } from './components/ChatBox';
import { AppHeader } from './components/AppHeader';
import { uuidV4 } from './uuidV4';
import { LoginScreen } from './components/LoginScreen';
import { useWebsocket } from './useWebsocket';

export const App = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [nodeId, setNodeId] = useState("");

  const { readyState, messageQueue, sendMessage } = useWebsocket('ws://localhost:3000');
  const emit = useCallback((event, data) => sendMessage(JSON.stringify({ event, data, nodeId })), [sendMessage, nodeId]);

  useEffect(() => {
    if (user !== null && readyState !== WebSocket.OPEN) return;
    const loginUser = {
      name: sessionStorage.getItem("userName"),
      id: sessionStorage.getItem("userId"),
    }
    if (loginUser.name === null || loginUser.id === null) return;
    setUser(loginUser)
    emit('join', { name: loginUser.name, id: uuidV4() })
  }, [readyState])

  useEffect(() => {

    if (messageQueue.length === 0) return;
    const chatMessages = [];

    for (const message of messageQueue) {
      const parsed = JSON.parse(message);
      if (parsed.event === 'welcome') setNodeId(parsed.data);
      if (parsed.event === 'chat') chatMessages.push(parsed.data);
      if (parsed.event === 'load-messages') chatMessages.unshift(...parsed.data);
    }

    if (chatMessages.length > 0) {
      setMessages([...messages, ...chatMessages]);
    }

  }, [messageQueue, setMessages])

  const handleSetUser = (username) => {
    if (username === null) {
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('userId');
      return setUser(null)
    }
    const loginUser = {
      name: username,
      id: uuidV4()
    }
    sessionStorage.setItem("userName", loginUser.name);
    sessionStorage.setItem("userId", loginUser.id);
    setUser(loginUser);
    emit('join', { name: loginUser.name, id: loginUser.id })
  }

  const say = (content) => {
    const message = {
      id: uuidV4(),
      content,
    };

    emit('chat', message);
  }

  return readyState === -1 ? h(ConnectingScreen) : (user === null ? h(LoginScreen, { handleSetUser }) : h("div",
    { style: "display:flex; flex-direction:column; align-items: center; height: 100%;" }, [
    h(AppHeader, { handleSetUser, nodeId }),
    h(MessageFeed, { messages }),
    h(ChatBox, { say })
  ]));
}