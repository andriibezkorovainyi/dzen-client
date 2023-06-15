import {useEffect} from 'react';
import {CommentServerPayload, Message, ServerPayload, UserI} from "../types";
import {addNewCommentToParent} from "../helpers/addNewCommentToParent";
import {addChildrenToParent} from "../helpers/addChildrenToParent";
import {useMainState} from "./useMainState";

const useWebSocket = (url: string) => {
    const {
        socketRef,
        isLoading,
        setIsLoading,
        receivedMessage,
        setReceivedMessage,
        comments,
        setComments,
        user,
        setUser,
        commentsCount,
        setCommentsCount,
    } = useMainState();

    console.log('useWebSocket:', user);

    const sendMessage = (message: Message) => {
        if (message.event !== 'getCommentsCount') {
            setIsLoading(true);
        }
        console.log('sendMessage', message);

        socketRef.current?.send(JSON.stringify(message));
    };

    const getCommentsCount = () => {
        const message: Message = {
            event: 'getCommentsCount',
            data: {}
        };

        sendMessage(message);
    };

    useEffect(() => {
        socketRef.current = new WebSocket(url);


        socketRef.current.onopen = () => {
            console.log('WebSocket is connected');

            setIsLoading(true);

            const initialMessage: Message = {
                event: 'getComments',
                data: {}
            };

            sendMessage(initialMessage);
            getCommentsCount();
        };

        socketRef.current.onmessage = (message) => {
            const messageData = JSON.parse(message.data) as ServerPayload;

            if (messageData.event !== 'getCommentsCount') {
                setIsLoading(false);
            }

            setReceivedMessage(messageData);
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket is closed');
        };

        socketRef.current.onerror = (error) => {
            console.log('WebSocket error: ', error);
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = undefined;
            }
        };

    }, [])

    useEffect(() => {
        console.log('receivedMessage: ', receivedMessage);

        if (receivedMessage) {
            const {event, data} = receivedMessage as ServerPayload;

            switch (event) {
                case 'getUser':
                    setUser(data as UserI);
                    break;

                case 'createUser':
                    setUser(data as UserI);
                    break;

                case 'getComments':
                    setComments(data as CommentServerPayload[]);
                    break;

                case 'createComment':
                    setComments(prev => {
                        const newComments = [data as CommentServerPayload, ...prev]

                        if (newComments.length > 25) {
                            newComments.pop();
                        }

                        sendMessage({event: 'getCommentsCount', data: {}})

                        return newComments;
                    })
                    sendMessage({event: 'getCommentsCount', data: {}})
                    break;

                case 'createAnswer':
                    setComments(prev => {
                        const {parentId, newComment} = data as { parentId: number, newComment: CommentServerPayload };

                        return addNewCommentToParent(parentId, newComment, [...prev]);
                    })
                    break;

                case 'getAnswers':
                    setComments(prev => {
                        const {parentId, children} = data as { parentId: number, children: CommentServerPayload[] };
                        return addChildrenToParent(parentId, children, [...prev]);
                    })
                    break;

                case 'getCommentsCount':
                    console.log('getCommentsCount', data);
                    setCommentsCount(data as number);
                    break;

                case 'createCommentError':
                    console.log('createCommentError', data);
                    break;

                default:
                    break;
            }
        }
    }, [receivedMessage]);

    return {
        receivedMessage,
        sendMessage,
        user,
        setUser,
        comments,
        isLoading,
        setIsLoading,
        commentsCount,
    };
};

export default useWebSocket;
