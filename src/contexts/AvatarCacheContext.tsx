import {createContext, useCallback, useState} from "react";
import axios from "axios";

interface AvatarCacheValue {
    avatarCache: AvatarCache;
    setAvatarCache: React.Dispatch<React.SetStateAction<AvatarCache>>;
    fetchAvatar: (avatarUrl: string) => void;
}

export interface AvatarCache {
    [avatarUrl: string]: string
}

export const AvatarCacheContext = createContext<AvatarCacheValue | undefined>(undefined);

export const AvatarsContextProvider = ({children}: { children: React.ReactNode }) => {
    const [avatarCache, setAvatarCache] = useState<AvatarCache>({});

    const fetchAvatar = useCallback(async (avatarUrl: string) => {
        if (avatarCache[avatarUrl]) {
            return;
        }

        try {
            const response = await axios.get(avatarUrl, {
                responseType: 'text',
            });

            setAvatarCache((prev) => ({
                ...prev,
                [avatarUrl]: response.data,
            }));
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
            } else {
                console.error('Error fetching avatar image:', error);
            }
        }
    }, [avatarCache]);

    const value = {
        avatarCache,
        setAvatarCache,
        fetchAvatar,
    };

    return (
        <AvatarCacheContext.Provider value={value}>
            {children}
        </AvatarCacheContext.Provider>
    )
}
