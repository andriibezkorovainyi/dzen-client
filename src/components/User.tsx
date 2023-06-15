import {FC} from 'react';
import '../styles/User.css';

interface Props {
    userName: string;
    avatarUrl: string;
    commentId?: number;
}

export const User: FC<Props> = ({avatarUrl, userName, commentId}) => {

    return (
        <div className={commentId ? 'user' : 'user-global'}>
            <img className="user-avatar" src={avatarUrl} alt={'avatar url'}/>
            <h2 className="user-name">{userName}</h2>
        </div>
    );
};
