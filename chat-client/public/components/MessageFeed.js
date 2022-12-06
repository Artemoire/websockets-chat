import { h } from '../preact';

const TextMessage = ({ message }) => {
  return h("div", null, h("b", null, message.user.name), ": ", message.content);
}

const InfoMessage = ({ message }) => {
  return h("div", { style: "font-size:12px; width: 100%; height: 0.5em;  border-bottom: 1px solid #888; color: #888; text-align: center; margin-top: 0.5rem; margin-bottom: 0.5rem" },
    h("span", { style: "background-color: white" }, message.content)
  )
}

const Message = ({ message }) => {
  switch (message.type) {
    case 'text':
      return h(TextMessage, { message })
    case 'info':
      return h(InfoMessage, { message })
    default:
      break;
  }
}

export const MessageFeed = ({ messages }) => {
  const messageFeed = messages.map(message => h(Message, { message }));

  return h("div", { style: "flex: 1 1; width: 600px; overflow:auto; word-break: break-all" },
    messageFeed
  );
}