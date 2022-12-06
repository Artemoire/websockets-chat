import { h } from '../preact';

const RANDOM_MESSAGES = ["Welcome Back!", "Aligning satellites...", "Channeling bits...", "Almost there...", "Scaling websockets..."];
const randomArrayIndex = (array) => Math.floor(Math.random() * array.length);

export const ConnectingScreen = () => {
  const message = RANDOM_MESSAGES[randomArrayIndex(RANDOM_MESSAGES)];
  return h("div", { style: "width: 100%; height:100%; background-color: royalblue; color: white; display: flex; justify-content: center; align-items: center" }, h("h3", null, message))
};