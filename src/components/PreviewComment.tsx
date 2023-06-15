import {useWebSocketContext} from "../hooks/useWebSocketContext";
import {User} from "./User";
import {PreviewImage} from "./PreviewImage";
import {openBase64FileInNewTab} from "../helpers/openBase64InNewTab";
import {CommentPreview, UserI} from "../types";
import {FC} from "react";
import "../styles/PreviewComment.css"

interface Props {
    previewComment: CommentPreview
    setPreviewComment: React.Dispatch<React.SetStateAction<CommentPreview | null>>
}

export const PreviewComment: FC<Props> = ({previewComment, setPreviewComment}) => {
    const {user} = useWebSocketContext();
    const {body, file = null} = previewComment as CommentPreview;
    const {userName, avatarUrl} = user as UserI;
    const dateObject = new Date();
    const date = dateObject.toLocaleDateString();
    const time = dateObject.toLocaleTimeString().slice(0, 5);

    return (
        <div className={"preview-comment-container"}>
            <div className={"preview-comment"}>
                <button
                    className={"preview-comment-close-button"}
                    onClick={() => setPreviewComment(null)}
                >
                    X
                </button>

                <div className={"comment"}>
                    <div className={"comment-info"}>
                        <User avatarUrl={avatarUrl} userName={userName}/>
                        <p>{`${date} в ${time}`}</p>
                    </div>

                    <p dangerouslySetInnerHTML={{__html: body}} className={"comment-body"}></p>

                    {file
                        ? file.dataUrl?.includes('image') ? (
                            <PreviewImage file={file.dataUrl}/>
                        ) : (
                            <div>
                                <button
                                    className={"comment-txt-open-button"}
                                    onClick={() => openBase64FileInNewTab(file.dataUrl ? file.dataUrl : '')}
                                >
                                    <img
                                        className={"comment-txt-icon"}
                                        src={"./src/assets/txt-icon.svg"}
                                        alt={"txt icon"}>
                                    </img>
                                    <span
                                        className={"comment-file-info"}>{`${file.fileName} ${Math.ceil(file.fileSize / 1024)} kb`}</span>
                                </button>
                            </div>

                        ) : ''}
                </div>
            </div>
        </div>
    )
};
