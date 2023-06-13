import {useState} from "react";
import {SignUp} from "./SignUp";
import {LogIn} from "./LogIn";
import '../styles/AddUser.css'


export const AddUser = () => {
    const [signUp, setSignUp] = useState<boolean>(false)
    const [logIn, setLogIn] = useState<boolean>(false)

    return (
        <>
            <div className={"add-user-buttons"}>
                {<button onClick={() => {
                    setSignUp(prev => !prev)
                    setLogIn(false)
                }}>Sign Up
                </button>}

                {<button onClick={() => {
                    setSignUp(false)
                    setLogIn(prev => !prev)
                }}>Log In
                </button>}
            </div>

            <div className={"add-user-container"}>

                {signUp ? (
                    <SignUp/>
                ) : ""}

                {logIn ? (
                    <LogIn/>
                ) : ""}
            </div>
        </>
    )
}
