import './ConnectingScreen.css'

const RANDOM_MESSAGES = ["Welcome Back!", "Aligning satellites...", "Channeling bits...", "Almost there...", "Scaling websockets..."];
const randomArrayIndex = (array) => Math.floor(Math.random() * array.length);
const randomArrayElement = (array) => array[randomArrayIndex(array)];

export function ConnectingScreen() {
  return (
    <div className="ConnectingScreen">
      <h3>{randomArrayElement(RANDOM_MESSAGES)}</h3>
    </div>)
}