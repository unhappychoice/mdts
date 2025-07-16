"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebSocket = void 0;
const react_1 = require("react");
const useWebSocket = () => {
    const [event, setEvent] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const ws = new WebSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host);
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setEvent(message);
            setTimeout(() => setEvent(null), 100);
        };
        return () => {
            ws.close();
        };
    }, []);
    return event;
};
exports.useWebSocket = useWebSocket;
