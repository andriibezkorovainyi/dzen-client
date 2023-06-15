import {CommentServerPayload, FileServerPayload, Message} from "../types";
import {FC, useState} from "react";
import {AddComment} from "./AddComment";
import {User} from "./User";
import {useWebSocketContext} from "../hooks/useWebSocketContext";
import "../styles/Comment.css"
import {PreviewImage} from "./PreviewImage";
import {openBase64FileInNewTab} from "../helpers/openBase64InNewTab";
import axios from "axios";

interface Props {
    comment: CommentServerPayload
}

export const Comment: FC<Props> = ({comment}) => {
    const [reply, setReply] = useState<boolean>(false)
    const {user, sendMessage, setIsLoading} = useWebSocketContext();
    const [seeAnswers, setSeeAnswers] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<string>();

    const {
        userName,
        avatarUrl,
        _count,
        children = [],
        createdAt,
        file
    } = comment as CommentServerPayload;

    console.log(_count.children)


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
        try {
            setIsLoading(true);
            const file = await axios.get(`${import.meta.env.VITE_HTTP}` + '/file' + fileUrl, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });

            setUploadedFile(file.data);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={"comment"}>
            <div className={"comment-info"}>
                <User avatarUrl={avatarUrl} userName={userName} commentId={comment.id}/>
                <p className={"comment-info-time"}>{`${date} в ${time}`}</p>
            </div>

            <p dangerouslySetInnerHTML={{__html: comment.body}} className={"comment-body"}></p>

            {_count.children ? (
                <>
                    <button className={"comment-answers-count"} onClick={handleGetAnswers}>
                        {seeAnswers ? 'Скрыть ответы' : `Количество ответов: ${_count.children}`}
                    </button>

                    {seeAnswers && (
                        children && children.map(child => {
                            return (
                                <Comment
                                    key={child.id}
                                    comment={child}
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
                                    src={"/public/txt-icon.svg"}
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
                user ? (
                    <AddComment key={comment.id} parentId={comment.id}/>
                ) : (<p className={"comment-auth-prompt"}>Авторизуйтесь, чтобы ответить</p>)
            )}
        </div>
    )
}
