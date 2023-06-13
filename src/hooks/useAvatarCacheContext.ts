import {useContext} from "react";
import {AvatarCacheContext} from "../contexts/AvatarCacheContext";

export const useAvatarCacheContext = () => {
    const avatarCacheContext = useContext(AvatarCacheContext);

    if (avatarCacheContext === undefined) {
        throw new Error(
            'useAvatarCacheContext must be used within a AvatarCacheProvider',
        );
    }

    return avatarCacheContext;
};
