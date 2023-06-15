import {useSearchParams} from "react-router-dom";
import {useWebSocketContext} from "../hooks/useWebSocketContext";
import {CommentsSearchParams, Message} from "../types";
import '../styles/Sorting.css'
import {useEffect} from "react";

export const Sorting = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const orderBy = searchParams.get('orderBy') || 'desc';
    const page = searchParams.get('page') || 1;
    const {sendMessage} = useWebSocketContext();

    const handleSortBy = (sortByInput: string) => {
        handleSearchParams(sortByInput);

        function handleSearchParams(input: string) {
            if (sortBy === input && orderBy === 'asc') {
                setSearchParams({});
                return;
            }

            if (sortBy === input) {
                setSearchParams({sortBy, orderBy: 'asc'});
                return;
            }

            if (input === 'default') {
                setSearchParams({});
                return;
            }

            setSearchParams({sortBy: input});
        }
    };

    useEffect(() => {
        const data: CommentsSearchParams = {
            sortBy,
            orderBy,
            page: +page
        };

        const message: Message = {
            event: 'getComments',
            data
        };

        sendMessage(message);
    }, [sortBy, orderBy, page])

    return (
        <div className="sorting">
            <h2 className="sorting-title">
                Сортировать по:
            </h2>
            <button className="sorting-item" onClick={() => handleSortBy('userName')}>
                Username
            </button>
            <button className="sorting-item" onClick={() => handleSortBy('email')}>
                Email
            </button>
            <button className="sorting-item" onClick={() => handleSortBy('createdAt')}>
                Date
            </button>
            <button className="sorting-item" onClick={() => handleSortBy('default')}>
                Default
            </button>
        </div>
    )
};
