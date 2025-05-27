import React, { useState } from "react";
import css from "./PostCard.module.css";
import { Link, useNavigate } from "react-router-dom";
import { toggleLike } from "../apis/postApi";
import { useSelector } from "react-redux";

const PostCard = ({ post }) => {
    const navigate = useNavigate();

    const goDetail = () => {
        navigate(`/detail/${post._id}`);
    };

    const handleAuthorClick = (e) => {
        e.stopPropagation();
    };

    return (
        <article className={css.postCard} onClick={goDetail}>
            <div className={css.post_img}>
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
                    <span>💬</span> <span>30</span>
                </p>
            </div>
            <p className={css.dec}>{post.summary}</p>
        </article>
    );
};

export default PostCard;
