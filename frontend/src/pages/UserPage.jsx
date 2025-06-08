import css from "./userpage.module.css";

export const UserPage = () => {
    return (
        <main className={css.userpage}>
            <h2>사용자페이지</h2>
            <section>
                <h3>사용자정보</h3>
                <div className={css.userInfo}>
                    <p>사용자 이름</p>
                    <p>패스워드</p>
                    <div>
                        <p>로그인 사용자와 userpage/:username 같으면 개인정보 수정 버튼 활성화</p>
                        <button className={css.editButton}>내 정보 수정</button>
                    </div>
                </div>
            </section>
            <section>
                <h3>사용자가 작성한 글</h3>
                <ul className={css.postList}>
                    <li className={css.postCard}>
                        <p>글제목</p>
                    </li>
                </ul>
            </section>
            <section>
                <h3>사용자가 작성한 댓글</h3>
                <ul className={css.commentList}>
                    <li className={css.commentCard}>
                        <p>댓글 내용</p>
                        <p>작성일</p>
                    </li>
                </ul>
            </section>
            <section>
                <h3>사용자가 좋아요 클릭한 글</h3>
                <ul className={css.likeList}>
                    <li className={css.likeCard}>
                        <img src="https://picsum.photos/200/300" alt="" />
                    </li>
                </ul>
            </section>
        </main>
    );
};
