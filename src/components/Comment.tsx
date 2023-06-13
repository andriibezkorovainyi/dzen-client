import {CommentServerPayload, FileServerPayload, Message} from "../types";
import {FC, useState} from "react";
import {AddComment} from "./AddComment";
import {User} from "./User";
import {useWebSocketContext} from "../hooks/useWebSocketContext";
import "../styles/Comment.css"
import {PreviewImage} from "./PreviewImage";
import axios from "axios";
import {openBase64FileInNewTab} from "../helpers/openBase64InNewTab";

interface Props {
    comment: CommentServerPayload
    addComment: JSX.Element
}

const HOST_NAME = import.meta.env.VITE_HOST_NAME || '192.168.0.102';
const HTTP_PORT = import.meta.env.VITE_HTTP_PORT || 80;

export const Comment: FC<Props> = ({comment, addComment}) => {
    const [reply, setReply] = useState<boolean>(false)
    const {user, sendMessage,} = useWebSocketContext();
    const [seeAnswers, setSeeAnswers] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<string>();

    const {
        userName,
        avatarUrl,
        childrenCount,
        children,
        createdAt,
        file
    } = comment as CommentServerPayload;


    const {
        name: fileName,
        url: fileUrl,
        type: fileType,
        size: fileSize
    } = file as FileServerPayload || {};

    if (file?.id === 9) {
        console.log(uploadedFile);
    }

    const dateObject = new Date(createdAt);
    const date = dateObject.toLocaleDateString();
    const time = dateObject.toLocaleTimeString().slice(0, 5);

    const handleGetAnswers = () => {
        if (!seeAnswers) {
            const message = {
                event: 'getAnswers',
                data: {
                    parentId: comment.id,
                    orderBy: 'asc'
                }
            }

            sendMessage(message as Message);
        }

        setSeeAnswers(!seeAnswers);
    }

    const handleUploadFile = async () => {
        const file = await axios.get(`http://${HOST_NAME}:${HTTP_PORT}/files${fileUrl}`, {
            headers: {
                'Content-Type': 'text/plain'
            }
        })
        setUploadedFile(file.data);
    }

    return (
        <div className={"comment"}>
            <div className={"comment-info"}>
                <User avatarUrl={avatarUrl} userName={userName}/>
                <p className={"comment-info-time"}>{`${date} в ${time}`}</p>
            </div>

            <p dangerouslySetInnerHTML={{__html: comment.body}} className={"comment-body"}></p>

            {childrenCount ? (
                <>
                    <button className={"comment-answers-count"} onClick={handleGetAnswers}>
                        {seeAnswers ? 'Скрыть ответы' : `Количество ответов: ${childrenCount}`}
                    </button>

                    {seeAnswers && (
                        children && children.map(child => {
                            return (
                                <Comment
                                    key={child.id}
                                    comment={child}
                                    addComment={<AddComment parentId={comment.id} key={comment.id}/>}
                                />
                            )
                        })
                    )}
                </>
            ) : ''}

            {file
                ? uploadedFile
                    ? fileType.includes('image') ? (
                        <PreviewImage file={uploadedFile as string}/>
                    ) : (
                        <div>
                            <button
                                className={"comment-txt-open-button"}
                                onClick={() => openBase64FileInNewTab(uploadedFile)}
                            >
                                <img
                                    className={"comment-txt-icon"}
                                    src={"./src/assets/txt-icon.svg"}
                                    alt={"txt icon"}>
                                </img>
                                <span
                                    className={"comment-file-info"}>{`${fileName} ${Math.ceil(fileSize / 1024)} kb`}</span>
                            </button>
                        </div>

                    ) : (
                        <button onClick={handleUploadFile} className={"comment-upload-button"}>
                            <span
                                className={"comment-file-info"}>{`➜ ${fileName} ${Math.ceil(fileSize / 1024)} kb`}</span>
                        </button>
                    )
                : ''}

            <button className={"comment-reply"} onClick={() => {
                setReply(!reply)
            }}>
                Ответить
            </button>

            {reply && (
                user ? (addComment) : (<p className={"comment-auth-prompt"}>Авторизуйтесь, чтобы ответить</p>)
            )}
        </div>
    )
}
