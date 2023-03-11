import { useEffect, useLayoutEffect, useState, useCallback, useRef } from './preactHooks'

export const useWebsocket = (url) => {
    const [messageQueue, setMessageQueue] = useState([]);
    const [readyState, setReadyState] = useState(-1);
    const [hasRecievedMessages, setHasRecievedMessages] = useState(false);
    const messageQueueRef = useRef([]);
    const wsRef = useRef(null);

    useEffect(() => {
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

        wsRef.current.onmessage = (ev) => {
            setHasRecievedMessages(true);
            messageQueueRef.current.push(ev.data);
        }

    }, []);

    useEffect(() => {
        if (hasRecievedMessages) {
            setHasRecievedMessages(false);
            setMessageQueue(messageQueueRef.current);
            messageQueueRef.current = [];
        }
    })


    const sendMessage = useCallback((message) => {
        if (wsRef.current === null || wsRef.current.readyState !== WebSocket.OPEN) return;
        wsRef.current.send(message);
    })

    return { readyState, messageQueue, sendMessage };
}