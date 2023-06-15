import {useWebSocketContext} from "../hooks/useWebSocketContext";
import {useSearchParams} from "react-router-dom";
import {Message} from "../types";
import '../styles/Pagination.css'
import {useEffect} from "react";
import isEqual from "lodash/isEqual"

export const Pagination = () => {
    const {commentsCount, sendMessage} = useWebSocketContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') || '1';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const orderBy = searchParams.get('orderBy') || 'desc';
    const pagesNumber = Math.ceil(commentsCount / 25);
    const bullets = Array.from({length: pagesNumber}, (_, i) => i + 1);

    const handleGetPage = (page: number) => {
        const existingSearchParams = Object.fromEntries(searchParams.entries());
        const updatedSearchParams = {
            ...existingSearchParams,
            page: String(page)
        };

        if (isEqual(existingSearchParams, updatedSearchParams)) return

        setSearchParams(updatedSearchParams)
    }

    useEffect(() => {
        const message: Message = {
            event: 'getComments',
            data: {
                orderBy,
                sortBy,
                page: +page
            }
        }

        sendMessage(message);
    }, [page])

    return (
        <div className="pagination">
            {bullets.map(bullet => (
                <button
                    key={bullet}
                    className={`pagination-item ${bullet === +page && 'active'}`}
                    onClick={() => handleGetPage(bullet)}
                >
                    {bullet}
                </button>
            ))}
        </div>
    )
}
