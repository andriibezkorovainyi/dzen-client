import {createContext} from "react";
import useWebSocket from "../hooks/useWebSocket";
import {Message, ServerPayload, UserI, CommentServerPayload} from "../types";
import * as React from "react";

export interface WebSocketContextValue {
    receivedMessage: ServerPayload | null;
    sendMessage: (message: Message) => void;
    user: UserI | undefined;
    comments: CommentServerPayload[];
    isLoading: boolean;
    commentsCount: number;
    setUser: (user: UserI) => void;
    setIsLoading: (isLoading: boolean) => void;
}

export const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

interface WebSocketProviderProps {
    children: React.ReactNode;
}

export const WebSocketProvider = ({
                                      children
                                  }: WebSocketProviderProps) => {
    const {
        receivedMessage,
        sendMessage,
        user,
        setUser,
        comments,
        isLoading,
        setIsLoading,
        commentsCount,
    } = useWebSocket(`${import.meta.env.VITE_WSS}`);

    const value = {
        receivedMessage,
        sendMessage,
        comments,
        user,
        setUser,
        isLoading,
        setIsLoading,
        commentsCount,
    }

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    )
};
