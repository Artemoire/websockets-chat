import { h } from '../preact';
import { useEffect, useState, useRef, useCallback } from '../preactHooks'

export const ChatBox = ({ say }) => {
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

    const said = ev.target.value.trim();
    if (said === '') return;
    say(said);

    setState({ value: '' });
    ev.preventDefault();
  }

  const handleClick = () => {
    const said = state.value.trim();
    if (said === '') return;
    say(said);

    setState({ value: '' })
  }


  return h("div", { style: "display: flex; width: 600px" },
    h("input", {
      type: "text", placeholder: "Aa",
      style: "flex: 1 1",
      ref, value: state.value, onKeyDown: handleKeyDown, onChange: handleChange
    }),
    h("button", { onClick: handleClick }, "Send")
  )
}