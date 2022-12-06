import { h } from '../preact';

export const AppHeader = ({ handleSetUser, nodeId }) => {
  return h("div", null,
    h("h1", { style: "background-color: #eee; color: #333; width: 600px; padding: 0.5rem 1rem; box-sizing: border-box; margin: 0;" },
      "Chat Service",
      h('small', { style: "font-weight: 400; font-size: 12px" }, " node: " + nodeId),
      h("button", { style: "float:right", onClick: () => handleSetUser(null) }, "Logout")
    ),
    // h("div", null,
    // )
  )
}