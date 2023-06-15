import {useRef} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

export const useCaptcha = () => {
    const captchaRef = useRef<ReCAPTCHA>(null);

    async function verifyToken(token: string) {
        try {
            await axios.post(`${import.meta.env.VITE_HTTP}/verify-token`, {
                secret: import.meta.env.VITE_SECRET_KEY,
                token: token,
            });

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const checkCaptcha = async () => {
        const token = captchaRef.current?.getValue();
        captchaRef.current?.reset();

        if (!token) {
            return 'Докажите что вы не робот';
        }

        const validToken = await verifyToken(token);

        if (!validToken) {
            console.log('Error verifying token');
        }

        return null;
    };

    return {checkCaptcha, captchaRef}
};
