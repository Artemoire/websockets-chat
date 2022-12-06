import { useEffect, useLayoutEffect, useState, useCallback, useRef } from './preactHooks'

export const useWebsocket = (url, config = {}) => {
  const [readyState, setReadyState] = useState(-1);
  const wsRef = useRef(null);

  useLayoutEffect(() => {
    wsRef.current = new WebSocket(url);
    wsRef.current.onopen = () => {
      console.log("[INFO] WebSocket Connection Opened");
      setReadyState(WebSocket.OPEN);
    }
    wsRef.current.onclose = () => {
      setReadyState(WebSocket.CLOSED);
      console.log("[INFO] WebSocket Connection Closed");
    }
    wsRef.current.onerror = (err) => console.error(err);
  }, []);

  useLayoutEffect(() => {
    wsRef.current.onmessage = (ev) => {
      if (config.onmessage) config.onmessage(ev.data);
      else {
        const events = config.events || {};

        const payload = JSON.parse(ev.data);
        if (payload.event in events) events[payload.event](payload.data);
      }
    }

    return () => {
      wsRef.current.onmessage = null;
    }
  })
  const sendMessage = useCallback((k) => {
    if (wsRef.current === null || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(k);
  }, []);

  const emit = useCallback((event, data) => {
    if (wsRef.current === null || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ event, data }));
  })

  return { readyState, emit, sendMessage };
}