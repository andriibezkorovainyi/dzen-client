import {useState} from "react";
import {useWebSocketContext} from "../hooks/useWebSocketContext";
import {useCaptcha} from "../hooks/useCaptcha";
import {validateUserSignUp} from "../validators/validateUserData";
import ReCAPTCHA from "react-google-recaptcha";
import '../styles/AddUser.css'
import axios from "axios";

export const SignUp = () => {
    const [userName, setUserName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [homePage, setHomePage] = useState<string>('')
    const {setUser, setIsLoading} = useWebSocketContext();
    const [signUpErrors, setSignUpErrors] = useState<string[]>([]);
    const {checkCaptcha, captchaRef} = useCaptcha();

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSignUpErrors([]);
        const errors = validateUserSignUp({userName, email, password, homePage});

        if (errors) {
            setSignUpErrors([...errors]);
            return;
        }

        const captchaError = await checkCaptcha();

        if (captchaError) {
            setSignUpErrors(prev => [...prev, captchaError]);
            return;
        }

        setIsLoading(true);

        const response = await axios.post(`${import.meta.env.VITE_HTTP}/user/create`, {
            userName,
            email,
            password,
            homePage
        });

        console.log('response.data:', response.data);

        if (response.data.errors) {
            setIsLoading(false);
            setSignUpErrors(prev => [...prev, ...response.data.errors]);
            return;
        }

        setIsLoading(false);
        setUser(response.data.user);
    }

    return (
        <>
            <form onSubmit={handleSignUp} className={"add-user-login"}>
                <input
                    className={"add-user-input"}
                    placeholder={'User Name'}
                    type={'text'}
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                />
                <input
                    className={"add-user-input"}
                    type={'text'}
                    placeholder={'Email'}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    className={"add-user-input"}
                    placeholder={'Home Page'}
                    type={'homePage'}
                    value={homePage}
                    onChange={e => setHomePage(e.target.value)}
                />
                <input
                    className={"add-user-input"}
                    placeholder={'Password'}
                    type={'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}/>
                <button
                    type={'submit'}
                >
                    Sign Up
                </button>

                {signUpErrors.length > 0 ? (
                    <ul className={"add-user-error-list"}>
                        {signUpErrors.map((error) => (
                            <li
                                className={"add-user-signup-error"}
                                key={error}
                            >
                                {error}
                            </li>
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
