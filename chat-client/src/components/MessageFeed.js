import "./MessageFeed.css"

function TextMessage({ message }) {
  return (
    <div>
      <b>{message.user.name}</b>: {message.content}
    </div>
  )
}

function InfoMessage({ message }) {
  return (
    <div className="InfoMessage">
      <span>{message.content}</span>
    </div>
  )
}

function Message({ message }) {
  switch (message.type) {
    case 'text':
      return <TextMessage message={message} />
    case 'info':
      return <InfoMessage message={message} />
    default:
      break;
  }
}

export function MessageFeed({ messages }) {
  return (
    <div className="MessageFeed">
      {messages.map((message, idx) => <Message message={message} key={idx} />)}
    </div>
  )
}