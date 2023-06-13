import {FC, useEffect} from "react";
import {CommentPreview, Message} from "../types";
import {useState} from "react";
import {useWebSocketContext} from "../hooks/useWebSocketContext";
import "../styles/AddComment.css"
import {PreviewImage} from "./PreviewImage";
import ReCAPTCHA from 'react-google-recaptcha';
import {openBase64FileInNewTab} from "../helpers/openBase64InNewTab";
import {validateCommentBody} from "../validators/validateCommentBody";
import {useCaptcha} from "../hooks/useCaptcha";
import {PreviewComment} from "./PreviewComment";
import {useFileUpload} from "../hooks/useFileUpload";

interface Props {
    parentId?: number | null
}

export const AddComment: FC<Props> = ({parentId = null}) => {
    const {user, sendMessage} = useWebSocketContext();
    const [body, setBody] = useState<string>('');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const {checkCaptcha, captchaRef} = useCaptcha();
    const [previewComment, setPreviewComment] = useState<CommentPreview | null>(null);
    const [file, setFile] = useState<string | null>(null);

    const {
        fileError,
        fileName,
        fileSize,
        validateFile,
        resetFileData,
    } = useFileUpload();

    useEffect(() => {
        if (previewComment) {
            document.body.classList.add("body-scroll-lock");
            setErrorMessages([]);
        } else {
            document.body.classList.remove("body-scroll-lock");
        }
    }, [previewComment]);

    console.log(errorMessages);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) {
            setErrorMessages(['Вы не авторизованы']);
            return;
        }

        const errors = validateCommentBody(body);

        if (errors) {
            setErrorMessages([...errors]);
            return;
        }

        const {userName, email, id, avatarUrl} = user;

        const captchaError = await checkCaptcha();

        if (captchaError) {
            setErrorMessages([captchaError]);
            return;
        }

        const message = {
            event: parentId ? 'createAnswer' : 'createComment',
            data: {
                body,
                userId: id,
                userName,
                email,
                parentId,
                avatarUrl,
                file: file ? {
                    fileName,
                    dataUrl: file,
                } : null,
            }
        } as Message;

        sendMessage(message);
        setBody('');
        setFile(null);
        resetFileData();
        setErrorMessages([]);
    }

    const addTag = (tag: string) => {
        const text = document.getElementById(`add-comment-input-text-${id}`) as HTMLTextAreaElement;
        const start = text.selectionStart;
        const end = text.selectionEnd;
        const selectedText = text.value.substring(start, end);
        const beforeText = text.value.substring(0, start);
        const afterText = text.value.substring(end, text.value.length);

        switch (tag) {
            case 'a':
                text.value = beforeText + '<a href="">' + selectedText + '</a>' + afterText;
                text.selectionStart = start + 9;
                text.selectionEnd = start + 9 + selectedText.length;
                break;

            case 'i':
                text.value = beforeText + '<i>' + selectedText + '</i>' + afterText;
                text.selectionStart = start + 3;
                text.selectionEnd = start + 3 + selectedText.length;
                break;

            case 'strong':
                text.value = beforeText + '<strong>' + selectedText + '</strong>' + afterText;
                text.selectionStart = start + 8;
                text.selectionEnd = start + 8 + selectedText.length;
                break;

            case 'code':
                text.value = beforeText + '<code>' + selectedText + '</code>' + afterText;
                text.selectionStart = start + 6;
                text.selectionEnd = start + 6 + selectedText.length;
                break;

            default:
                break;
        }

        text.focus();
    };

    const handlePreview = () => {
        const errors = validateCommentBody(body);
        if (errors) {
            setErrorMessages(errors);
            return;
        }

        if (fileError) {
            setErrorMessages(['Файл не поддерживается']);
            return;
        }

        setPreviewComment({
            body,
            file: file ? {
                fileName,
                dataUrl: file,
                fileSize,
            } : null,
        })

        setErrorMessages([]);
    };

    const id = parentId ? parentId : 0;

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        resetFileData();
        setErrorMessages([]);
        const eventFile = event.target.files?.[0];

        if (!eventFile) {
            return;
        }

        const fileDataUrl = await validateFile(eventFile);

        if (!fileDataUrl || fileError) {
            setErrorMessages(['Файл не поддерживается']);
            return;
        }

        setFile(fileDataUrl);
    };

    const resetFile = () => {
        setFile(null);
        resetFileData();
        setErrorMessages([]);
    };

    return (
        <div className={"add-comment-container"}>
            <form onSubmit={handleSubmit} className={"add-comment-form"}>
                <div className={"add-comment-tags"}>
                    {['a', 'i', 'strong', 'code'].map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            className={"add-comment-tag-button"}
                            onClick={() => addTag(tag)}
                        >
                            <img src={`./src/assets/${tag}-icon.svg`} alt={tag} className={"add-comment-tag-image"}/>
                        </button>
                    ))}
                </div>
                <textarea
                    className={"add-comment-input-text"}
                    placeholder={"Введите ваше сообщение"}
                    rows={3}
                    cols={50}
                    value={body}
                    id={`add-comment-input-text-${id}`}
                    onChange={(event) => {
                        setErrorMessages([]);
                        setBody(event.target.value);
                    }}
                />
                <div className={"add-comment-buttons-container"}>

                    {!file
                        ? !fileError
                            ? (<label htmlFor={`input-file-${id}`} className={"add-comment-input-file"}>
                                <input
                                    className={"input-file"}
                                    id={`input-file-${id}`}
                                    type="file"
                                    max={1}
                                    key={file ? file : Math.random().toString()}
                                    accept=".jpg, .jpeg, .gif, .png, .txt"
                                    onChange={handleFileChange}
                                />Выберите файл</label>)
                            : (<button type="button" className={"add-comment-input-file"} onClick={resetFile}
                            >
                                Сбросить файл
                            </button>)
                        : (<div className={"add-comment-files"}>

                            {(file.includes('data:text/')
                                ? (
                                    <button
                                        type="button"
                                        onClick={() => openBase64FileInNewTab(file)}
                                        className={"add-comment-text-file-info"}
                                    >
                                        <span>{fileName && fileName}</span>
                                        <span>{`${fileSize && Math.ceil(fileSize / 1024)} kb`}</span>
                                    </button>
                                )
                                : (<PreviewImage file={file as string}/>))}

                            <button
                                className={"add-comment-remove-file"}
                                onClick={resetFile}
                            >
                                ×
                            </button>
                        </div>)}

                    <button
                        type="button"
                        onClick={handlePreview}
                        className={"add-comment-action-button"}
                    >
                        Предпросмотр
                    </button>
                    <button
                        type="submit"
                        className={"add-comment-action-button"}
                    >
                        Отправить
                    </button>
                </div>

                {errorMessages.length > 0 ? (
                    <ul className={"add-comment-error-messages"}>
                        {errorMessages.map((error) => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                ) : null}

            </form>
            <div className={"add-comment-captcha-container"}>
                <ReCAPTCHA
                    sitekey={import.meta.env.VITE_SITE_KEY}
                    ref={captchaRef}
                />
            </div>

            {previewComment && (
                <PreviewComment previewComment={previewComment} setPreviewComment={setPreviewComment}/>
            )}

        </div>
    )
}
