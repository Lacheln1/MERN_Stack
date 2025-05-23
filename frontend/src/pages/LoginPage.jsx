import React from "react";
import css from "./RegisterPage.module.css";
const LoginPage = () => {
  return (
    <main className={css.loginpage}>
      <h2>로그인 페이지</h2>
      <form action="" className={css.container}>
        <input type="text" placeholder="아이디" />
        <strong>에러메시지</strong>
        <input type="password" placeholder="패스워드" />
        <strong>에러메시지</strong>
        <button type="submit">로그인</button>
      </form>
    </main>
  );
};

export default LoginPage;
