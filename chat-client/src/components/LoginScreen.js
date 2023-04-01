import { useCallback, useEffect, useRef, useState } from "react";
import "./LoginScreen.css"

export function LoginScreen({ handleSetUser }) {
  const ref = useRef(null);
  const [inputState, setInputState] = useState("");

  useEffect(() => {
    if (ref.current !== null && inputState.value === "") ref.current.focus();
  });

  const sendInput = useCallback((input) => {
    if (input === '') return;
    handleSetUser(input);
    setInputState('');
  }, [handleSetUser])

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
    <div className="LoginBackground" >
      <div className="LoginCard">
        <h1 className="AlignCenter">Input username</h1>
        <div className="AlignCenter">
          <input type="text" placeholder="Username"
            ref={ref}
            onKeyDown={handleKeyDown} onChange={handleChange}
            value={inputState}
          />
          <button onClick={handleClick}><b>Login</b></button>
        </div>
        <h1> </h1>
      </div>
    </div >
  )
}