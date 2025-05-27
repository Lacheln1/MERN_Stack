import React, { useState } from "react";
import css from "./PostCard.module.css";
import { Link, useNavigate } from "react-router-dom";
import { toggleLike } from "../apis/postApi";

const PostCard = ({ post }) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes ? post.likes.length : 0);

    const goDetail = () => {
        navigate(`/detail/${post._id}`);
    };
    const handleAuthorClick = (e) => {
        e.stopPropagation();
    };

    const handleLikeToggle = async (e) => {
        e.stopPropagation(); // 이벤트 전파를 막습니다

        try {
            // 좋아요 토글 API 호출
            const updatedPost = await toggleLike(post._id);

            // 상태 업데이트
            setIsLiked(!isLiked);
            setLikesCount(updatedPost.likes.length);
        } catch (error) {
            console.error("좋아요 토글 실패:", error);

            // 로그인이 필요한 경우 로그인 페이지로 이동
            if (error.response && error.response.status === 401) {
                alert("로그인이 필요합니다.");
                navigate("/login");
            }
        }
    };
    return (
        <article className={css.postCard}>
            <div className={css.post_img}>
                <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
            </div>
            <h3 className={css.title}>{post.title}</h3>

            <div className={css.info}>
                <p>
                    <Link to={`/mypage`} className={css.author}>
                        somy
                    </Link>
                    <time className={css.date}>{formatDate(post.createdAt)}</time>
                </p>
                <p>
                    <span onClick={handleLikeToggle}> {isLiked ? "❤️" : "🤍"}</span>{" "}
                    <span>{likesCount}</span>
                    <span>💬</span> <span>30</span>
                </p>
            </div>
            <p className={css.dec}>{post.summary}</p>
        </article>
    );
};

export default PostCard;
