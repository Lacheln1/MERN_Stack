import React from "react";
import css from "./RegisterPage.module.css";
const RegisterPage = () => {
  return (
    <main className={css.registerpage}>
      <h2>회원가입 페이지</h2>
      <form action="" className={css.container}>
        <input type="text" placeholder="사용자명" />
        <strong>에러메시지</strong>
        <input type="password" placeholder="패스워드" />
        <strong>에러메시지</strong>
        <input type="password" placeholder="패스워드 확인" />
        <strong>에러메시지</strong>
        <button type="submit">가입하기</button>
      </form>
    </main>
  );
};

export default RegisterPage;
