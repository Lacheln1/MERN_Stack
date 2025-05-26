import React from "react";
import css from "./PostListPage.module.css";
import PostCard from "./PostCard";
const PostListPage = () => {
    return (
        <main className={css.postListPage}>
            <h2>글 목록</h2>
            <ul className={css.postList}>
                <li>
                    <PostCard />
                </li>
                <li>
                    <PostCard />
                </li>
                <li>
                    <PostCard />
                </li>
                <li>
                    <PostCard />
                </li>
            </ul>
        </main>
    );
};

export default PostListPage;
