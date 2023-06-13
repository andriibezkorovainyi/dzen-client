import {useContext} from "react";
import {WebSocketContext} from "../contexts/WebSocketContext";

export const useWebSocketContext = () => {
    const webSocketContext = useContext(WebSocketContext);

    if (webSocketContext === undefined) {
        throw new Error(
            'useWebSocketContext must be used within a WebSocketProvider',
        );
    }

    return webSocketContext;
}
