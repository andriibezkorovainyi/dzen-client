import {useRef} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const HOST_NAME = import.meta.env.VITE_HOST_NAME || '192.168.0.102';
const HTTP_PORT = import.meta.env.VITE_HTTP_PORT || 80;

export const useCaptcha = () => {
    const captchaRef = useRef<ReCAPTCHA>(null);

    async function verifyToken(token: string) {
        try {
            await axios.post(`http://${HOST_NAME}:${HTTP_PORT}/verify-token`, {
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
