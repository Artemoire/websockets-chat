import { useEffect, useRef, useState } from "react";
import "./LoginScreen.css"

export function LoginScreen({ handleSetUser }) {
  const ref = useRef(null);
  const [state, setState] = useState({ value: "" });

  useEffect(() => {
    if (ref.current !== null && state.value === "") ref.current.focus();
  });

  const handleChange = (ev) => {
    setState({ value: ev.target.value })
  }

  const handleKeyDown = (ev) => {
    if (ev.code !== 'Enter') return;

    const username = ev.target.value.trim();
    if (username === '') return;

    handleSetUser(username);
    setState({ value: '' });
    ev.preventDefault();
  }

  const handleClick = () => {
    const username = state.value.trim();
    if (username === '') return;

    handleSetUser(username)
    setState({ value: '' })
  }

  return (
    <div className="LoginBackground" >
      <div className="LoginCard">
        <h1 className="AlignCenter">Input username</h1>
        <div className="AlignCenter">
          <input type="text" placeholder="Username"
            ref={ref}
            onKeyDown={handleKeyDown} onChange={handleChange}
            value={state.value}
          />
          <button onClick={handleClick}><b>Login</b></button>
        </div>
        <h1> </h1>
      </div>
    </div >
  )
}