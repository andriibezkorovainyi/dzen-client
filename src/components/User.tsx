import {FC, useEffect, useState} from 'react';
import '../styles/User.css';
import {useAvatarCacheContext} from '../hooks/useAvatarCacheContext';

interface Props {
    userName: string;
    avatarUrl: string;
}

export const User: FC<Props> = ({avatarUrl, userName}) => {
    const {avatarCache, fetchAvatar} = useAvatarCacheContext();
    const [avatar, setAvatar] = useState<string | undefined>(avatarCache[avatarUrl]);

    useEffect(() => {
        if (!avatar) {
            fetchAvatar(avatarUrl);
        }
    }, [avatar, fetchAvatar, avatarUrl]);

    useEffect(() => {
        setAvatar(avatarCache[avatarUrl]);
    }, [avatarCache, avatarUrl]);

    return (
        <div className="user">
            <svg className="user-avatar" dangerouslySetInnerHTML={{__html: avatar ? avatar : ''}}/>
            <h2 className="user-name">{userName}</h2>
        </div>
    );
};
