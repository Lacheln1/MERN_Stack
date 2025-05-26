import React from "react";
import css from "./PostListPage.module.css";
import PostCard from "./PostCard";
import { useState } from "react";
import { useEffect } from "react";
import { getPostList } from "../apis/postApi";
const PostListPage = () => {
    const [postList, setPostList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostList = async () => {
            try {
                setIsLoading(true);
                const data = await getPostList();
                console.log("목록 조회 성공:", data);

                setPostList(data.posts);
            } catch (error) {
                console.log("목록 조회 실패", error);
                setError("글 목록을 불러오는 데 실패했습니다");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPostList;
    }, []);

    return (
        <main className={css.postListPage}>
            <h2>글 목록</h2>
            {error && <p className={css.errorMessage}>{error}</p>}
            {isLoading ? (
                <p>로딩중...</p>
            ) : postList.length === 0 ? (
                <p className={css.noPostMessage}>첫번째 글의 주인공이 되어주세요</p>
            ) : (
                <ul className={css.postList}>
                    {postList.map((post) => (
                        <li key={post._id}>
                            <PostCard post={post} />
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default PostListPage;
