import { h } from '../preact';
import { useEffect, useState, useRef } from '../preactHooks'

export const LoginScreen = ({ handleSetUser }) => {
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

  return h("div", { style: "width: 100%; height:100%; background-color: royalblue; color: white; display: flex; justify-content: center; align-items: center" },
    h("div", { style: "background-color: white; color: #333; width: 600px; display: flex; flex-direction: column; justify-content: align-items: center; box-shadow: 2px 2px 1px 1px black;" },
      h("h1", { style: "text-align: center" }, "Choose your username"),
      h("div", { style: "text-align: center;" },
        h("input", { type: "text", placeholder: "Username", ref, value: state.value, onKeyDown: handleKeyDown, onChange: handleChange }),
        h("button", { onClick: handleClick }, h("b", null, "Login"))
      ),
      h("h1", null, " ")
    )
  )
}