import {useWebSocketContext} from "../hooks/useWebSocketContext";
import {useSearchParams} from "react-router-dom";
import {Message} from "../types";
import '../styles/Pagination.css'

export const Pagination = () => {
    const {commentsCount, sendMessage} = useWebSocketContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') || 1;
    const pagesNumber = Math.ceil(commentsCount / 25);
    const bullets = Array.from({length: pagesNumber}, (_, i) => i + 1);

    const handleGetPage = (page: number) => {
        setSearchParams((prev) => ({...prev, page}));

        const message: Message = {
            event: 'getComments',
            data: {...searchParams, page}
        }

        sendMessage(message);
    }

    return (
        <div className="pagination">
            {bullets.map(bullet => {
                if (bullet === +page) {
                    return (
                        <button
                            key={bullet}
                            className="pagination-item active"
                        >
                            {bullet}
                        </button>
                    )
                } else {
                    return (
                        <button
                            key={bullet}
                            className="pagination-item"
                            onClick={() => handleGetPage(bullet)}
                        >
                            {bullet}
                        </button>
                    )
                }
            })}
        </div>
    )
}
