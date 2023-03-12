import "./AppHeader.css"

export function AppHeader({ handleSetUser, nodeId }) {

  const handleLogout = () => handleSetUser(null);

  return (
    <div>
      <h1 className="AppHeader">ChatRoom
        <small className="AppHeaderSmall">node: {nodeId}</small>
        <button onClick={handleLogout} style={{ float: "right" }}>Logout</button>
      </h1>
    </div >
  )
}