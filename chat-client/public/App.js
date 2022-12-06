import { h } from './preact';
import { useEffect, useState, useCallback, useRef } from './preactHooks'
import { ConnectingScreen } from './components/ConnectingScreen';
import { MessageFeed } from './components/MessageFeed';
import { ChatBox } from './components/ChatBox';
import { AppHeader } from './components/AppHeader';
import { useWebsocket } from './useWebsocket';
import { uuidV4 } from './uuidV4';
import { LoginScreen } from './components/LoginScreen';

export const App = () => {

  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [nodeId, setNodeId] = useState("");

  const { readyState, emit } = useWebsocket('ws://localhost:3000', {
    events: {
      hear: (message) => {
        setMessages([...messages, message]);
      },
      welcome: (message) => {
        setNodeId(message);
      }
    }
  });

  useEffect(() => {
    if (user !== null) return;
    const loginUser = {
      name: sessionStorage.getItem("userName"),
      id: sessionStorage.getItem("userId"),
    }
    if (loginUser.name === null || loginUser.id === null) return;
    setUser(loginUser)
    emit('join', { name: loginUser.name })
  }, [])

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
    emit('join', { name: loginUser.name })
  }

  const say = (content) => {
    const message = {
      id: uuidV4(),
      user,
      content,
      type: 'text'
    };

    emit('say', message);
  }

  return readyState === -1 ? h(ConnectingScreen) : (user === null ? h(LoginScreen, { handleSetUser }) : h("div",
    { style: "display:flex; flex-direction:column; align-items: center; height: 100%;" }, [
    h(AppHeader, { handleSetUser, nodeId }),
    h(MessageFeed, { messages }),
    h(ChatBox, { say })
  ]));
}