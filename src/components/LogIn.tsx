import {useWebSocketContext} from "../hooks/useWebSocketContext";
import {useState} from "react";
import {useCaptcha} from "../hooks/useCaptcha";
import ReCAPTCHA from "react-google-recaptcha";
import {validateUserLogIn} from "../validators/validateUserData";
import '../styles/AddUser.css'
import axios from "axios";


const HOST_NAME = import.meta.env.VITE_HOST_NAME;
const HTTP_PORT = import.meta.env.VITE_HTTP_PORT;

export const LogIn = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {setUser, setIsLoading} = useWebSocketContext();
    const {captchaRef, checkCaptcha} = useCaptcha();
    const [logInErrors, setLogInErrors] = useState<string[]>([]);

    const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
        setLogInErrors([]);
        e.preventDefault();

        const errors = validateUserLogIn({email, password});

        if (errors) {
            setLogInErrors(prev => [...prev, ...errors]);
            return;
        }

        const captchaError = await checkCaptcha();

        if (captchaError) {
            console.log(captchaError);

            setLogInErrors((prev) => [...prev, captchaError]);
            return;
        }

        setIsLoading(true);

        const response = await axios.post(`http://${HOST_NAME}:${HTTP_PORT}/get-user`, {
            email,
            password
        })

        if (response.data.errors) {
            setIsLoading(false);
            setLogInErrors((prev) => [...prev, ...response.data.errors]);
            return;
        }

        console.log('response.data:', response.data);

        setIsLoading(false);
        setUser(response.data.user);
    }

    return (
        <>
            <form onSubmit={handleLogIn} className={"add-user-login"}>
                <input
                    className={"add-user-input"}
                    id={'email'}
                    type={'text'}
                    value={email}
                    placeholder={'Email'}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    className={"add-user-input"}
                    placeholder={'Password'}
                    type={'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    className={"add-user-action-button"}
                    type={'submit'}
                >
                    Log In
                </button>

                {logInErrors.length > 0 ? (
                    <ul className={"add-user-error-list"}>
                        {logInErrors.map((error) => (
                            <li className={"add-user-error-item"} key={error}>{error}</li>
                        ))}
                    </ul>
                ) : ""}

                <ReCAPTCHA
                    sitekey={import.meta.env.VITE_SITE_KEY}
                    ref={captchaRef}
                />
            </form>
        </>
    )
};
