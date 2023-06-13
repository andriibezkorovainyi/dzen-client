import {useRef, useState} from "react";
import {CommentServerPayload, ServerPayload, UserI} from "../types";

export const useMainState = () => {
    const socketRef = useRef<WebSocket>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [commentsCount, setCommentsCount] = useState<number>(0);
    const [receivedMessage, setReceivedMessage] = useState<ServerPayload | null>(null);
    const [comments, setComments] = useState<CommentServerPayload[]>([])
    const [user, setUser] = useState<UserI>();

    const [userErrors, setUserErrors] = useState<string[]>([]);

    const handleSetUserErrors = (errors: string[]) => {
        setUserErrors(errors);
    };

    return {
        userErrors,
        handleSetUserErrors,
        socketRef,
        isLoading,
        setIsLoading,
        commentsCount,
        setCommentsCount,
        receivedMessage,
        setReceivedMessage,
        comments,
        setComments,
        user,
        setUser,
    };
};
