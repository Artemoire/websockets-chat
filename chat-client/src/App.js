import './App.css';
import useWebSocket from 'react-use-websocket';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { ConnectingScreen } from './components/ConnectingScreen';
import { MessageFeed } from './components/MessageFeed';
import { ChatBox } from './components/ChatBox';
import { AppHeader } from './components/AppHeader';
import { LoginScreen } from './components/LoginScreen';

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [nodeId, setNodeId] = useState("");

  // console.log('Render');
  const { lastMessage, readyState, sendMessage } = useWebSocket('ws://localhost:3000/')
  const emit = useCallback((event, payload) => sendMessage(JSON.stringify({ event, payload, nodeId })), [sendMessage, nodeId]);

  useEffect(() => {
    if (user !== null || readyState !== WebSocket.OPEN) return;
    const loginUser = {
      name: sessionStorage.getItem("userName"),
      id: sessionStorage.getItem("userId"),
    }
    if (loginUser.name === null || loginUser.id === null) return;
    setUser(loginUser)
    emit('join', { name: loginUser.name, id: uuidV4() })
  }, [readyState])

  useEffect(() => {
    if (lastMessage === null) return;

    const lastJsonMessage = JSON.parse(lastMessage.data);

    if (lastJsonMessage.event === 'welcome') setNodeId(lastJsonMessage.payload);
    if (lastJsonMessage.event === 'load-messages') setMessages((messages) => [...lastJsonMessage.payload, ...messages])
    if (lastJsonMessage.event === 'chat') setMessages((messages) => [...messages, lastJsonMessage.payload])

  }, [lastMessage, setMessages])

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

  if (readyState === 0) return (<ConnectingScreen />);
  if (user === null) return (<LoginScreen handleSetUser={handleSetUser} />);
  return (
    <div className="App">
      <AppHeader handleSetUser={handleSetUser} nodeId={nodeId} />
      <MessageFeed messages={messages} />
      <ChatBox say={say} />
    </div>
  );

  // return (
  //   readyState === 0 ? (<ConnectingScreen />) : (
  //     user === null ? (<LoginScreen handleSetUser={handleSetUser} />) :
  //       (<div>
  //         <AppHeader handleSetUser={handleSetUser} nodeId={nodeId} />
  //         <MessageFeed messages={messages} />
  //         <ChatBox say={say} />
  //       </div>)
  //   )
  // );
}

export default App;
