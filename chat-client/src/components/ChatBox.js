import { useCallback, useEffect, useRef, useState } from "react";

export function ChatBox({ say }) {
  const ref = useRef(null);
  const [inputState, setInputState] = useState("");

  useEffect(() => {
    if (ref.current !== null && inputState === "") ref.current.focus();
  });

  const sendInput = useCallback((input) => {
    if (input === '') return;
    say(input);
    setInputState('');
  }, [say])

  const handleChange = (ev) => {
    setInputState(ev.target.value)
  }

  const handleKeyDown = (ev) => {
    if (ev.code !== 'Enter') return;
    sendInput(ev.target.value.trim());
    ev.preventDefault();
  }

  const handleClick = () => {
    sendInput(inputState.value.trim());
  }

  return (
    <div style={{ display: "flex", width: "600px" }}>
      <input type="text" placeholder="Aa" style={{ flex: "1 1" }}
        ref={ref}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={inputState}
      />
      <button onClick={handleClick}>Send</button>
    </div>
  )
}