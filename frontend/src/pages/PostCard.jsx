import React from "react";
import css from "./PostCard.module.css";
import { Link } from "react-router-dom";

const PostCard = () => {
    return (
        <article className={css.postCard}>
            <div className={css.post_img}>
                <img src="https://picsum.photos/600/300" alt="" />
            </div>
            <h3 className={css.title}>포스트 제목</h3>

            <div className={css.info}>
                <p>
                    <Link to={`/mypage`} className={css.author}>
                        레헬
                    </Link>
                    <time datetime="" className={css.date}>
                        2025.05.26
                    </time>
                </p>
            </div>
            <p className={css.dec}>
                요약 내용이 들어갑니다. 내용이 길 ~~~ 수 있어요. 요약 내용이 들어갑니다. 내용이 길
                ~~~ 수 있어요. 요약 내용이 들어갑니다. 내용이 길 ~~~ 수 있어요. 요약 내용이
                들어갑니다. 내용이 길 ~~~ 수 있어요. 요약 내용이 들어갑니다. 내용이 길 ~~~ 수 있어요
            </p>
        </article>
    );
};

export default PostCard;
