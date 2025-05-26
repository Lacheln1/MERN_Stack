import React from "react";
import css from "./RegisterPage.module.css";
import { useState } from "react";
const LoginPage = () => {
    const [userName, setUserName] = useState("");
    const [passWord, setPassWord] = useState("");
    const [errUserName, setErrUserName] = useState("");
    const [errPassWord, setErrPassWord] = useState("");

    const validateUserName = (value) => {
        if (!value) {
            setErrUserName("");
            return;
        }

        if (!/^[a-zA-Z][a-zA-Z0-9]{3,}$/.test(value)) {
            setErrUserName("사용자명은 영문자로 시작하는 4자 이상의 영문자 또는 숫자여야 합니다");
        } else {
            setErrUserName("");
        }
    };

    const validatePassWord = (value) => {
        if (!value) {
            setErrPassWord("");
            return;
        }
        if (value.length < 4) {
            setErrPassWord("패스워드는 4자 이상이어야 합니다");
        } else {
            setErrPassWord("");
        }
    };

    const handleUserNameChange = (e) => {
        const value = e.target.value;
        setUserName(value);
        validateUserName(value);
    };

    const handlePassWordChange = (e) => {
        const value = e.target.value;
        setPassWord(value);
        validatePassWord(value);
    };

    const login = async (e) => {
        e.preventDefault();
        console.log("로그인");
    };
    return (
        <main className={css.loginpage}>
            <h2>로그인 페이지</h2>
            <form action="" className={css.container} onSubmit={login}>
                <input
                    type="text"
                    placeholder="아이디"
                    onChange={handleUserNameChange}
                    value={userName}
                />
                <strong>{errUserName}</strong>
                <input
                    type="password"
                    placeholder="패스워드"
                    onChange={handlePassWordChange}
                    value={passWord}
                />
                <strong>{errPassWord}</strong>
                <button type="submit">로그인</button>
            </form>
        </main>
    );
};

export default LoginPage;
