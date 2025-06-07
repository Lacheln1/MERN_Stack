import React from "react";
import { Link } from "react-router-dom";
import css from "./postcard.module.css";
import { formatDate } from "../utils/features";
import { useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";

const PostCard = ({ post }) => {
    const navigate = useNavigate();

    const goDetail = () => {
        navigate(`/detail/${post._id}`);
    };

    const handleAuthorClick = (e) => {
        e.stopPropagation();
    };
    return (
        <article className={css.postcard} onClick={goDetail}>
            <div className={css.popst_img}>
                <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
            </div>
            <h3 className={css.title}>{post.title}</h3>

            <div className={css.info}>
                <p>
                    <Link
                        to={`/mypage/${post.author}`}
                        onClick={handleAuthorClick}
                        className={css.author}
                    >
                        {post.author}
                    </Link>
                    <time className={css.date}>{formatDate(post.createdAt)}</time>
                </p>
                <p>
                    <LikeButton postId={post._id} likes={post.likes} />
                    <span>💬</span> <span>{post.commentCount || 0}</span>
                </p>
            </div>
            <p className={css.dec}>{post.summary}</p>
        </article>
    );
};

export default PostCard;
