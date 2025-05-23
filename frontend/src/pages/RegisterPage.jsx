import React, { useState } from "react";
import css from "./RegisterPage.module.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../apis/userApi";
const RegisterPage = () => {
    const [userName, setUserName] = useState("");
    const [passWord, setPassWord] = useState("");
    const [passWordOk, setPassWordOk] = useState("");
    const [errUserName, setErrUserName] = useState("");
    const [errPassWord, setErrPassWord] = useState("");
    const [errPassWordOk, setErrPassWordOk] = useState("");

    const [registerState, setRegisterState] = useState("");
    const navigate = useNavigate();

    const validateUsername = (value) => {
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

    const validatePassWordCheck = (value, current = passWord) => {
        if (!value) {
            setErrPassWordOk("");
            return;
        }
        if (value !== current) {
            setErrPassWordOk("패스워드가 일치하지 않습니다");
        } else {
            setErrPassWordOk("");
        }
    };

    const handleUserNameChange = (e) => {
        const value = e.target.value;
        setUserName(value);
        validateUsername(value);
    };

    const handlePassWordChange = (e) => {
        const value = e.target.value;
        setPassWord(value);
        validatePassWord(value);
    };

    const handlePassWordOkChange = (e) => {
        const value = e.target.value;
        setPassWordOk(value);
        validatePassWordCheck(value);
    };

    //회원가입 버튼 클릭 시 1. 유효성 검사 2. 회원가입 api호출 3. 성공 시 로그인 페이지로 이동
    const register = async (e) => {
        e.preventDefault();
        console.log("회원가입", userName, passWord, passWordOk);
        validateUsername(userName);
        validatePassWord(passWord);
        validatePassWordCheck(passWordOk, passWord);

        if (errUserName || errPassWord || errPassWordOk || !userName || !passWord || !passWordOk) {
            return;
        }

        try {
            setRegisterState("등록중");

            const response = await registerUser({
                userName,
                passWord,
            });

            console.log("회원가입 성공", response.data);

            setRegisterState("등록완료");
            navigate("/login");
        } catch (error) {
            setRegisterState("회원가입 실패");
            if (errPassWord.response) {
                console.log("오류 응답 데이터--", err.response.data);
            }
        }
    };

    return (
        <main className={css.registerpage}>
            <h2>회원가입 페이지</h2>
            <form action="" className={css.container} onSubmit={register}>
                <input
                    type="text"
                    placeholder="사용자명"
                    value={userName}
                    onChange={handleUserNameChange}
                />
                <strong>{errUserName}</strong>
                <input
                    type="password"
                    placeholder="패스워드"
                    value={passWord}
                    onChange={handlePassWordChange}
                />
                <strong>{errPassWord}</strong>
                <input
                    type="password"
                    placeholder="패스워드 확인"
                    value={passWordOk}
                    onChange={handlePassWordOkChange}
                />
                <strong>{errPassWordOk}</strong>
                <button type="submit">가입하기</button>
            </form>
        </main>
    );
};

export default RegisterPage;
