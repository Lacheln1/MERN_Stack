import React from "react";
import css from "./PostListPage.module.css";
import PostCard from "./PostCard";
import { useState } from "react";
import { useEffect } from "react";
import { getPostList } from "../apis/postApi";
import { useRef } from "react";
import { useCallback } from "react";
const PostListPage = () => {
    const [postList, setPostList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    //페이지네이션을 위한 상태 추가
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const listRef = useRef(null);
    const observer = useRef();

    //마지막 게시물 요소를 감지하는 ref 콜백
    const lastPostElementRef = useCallback(
        (node) => {
            if (isLoading || !node) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });
            observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    useEffect(() => {
        const fetchPostList = async () => {
            try {
                //페이지가 0보다 크면 로딩
                if (page > 0) setIsLoading(true);

                //수정된 페이지 정보 전달
                const data = await getPostList();
                console.log("목록 조회 성공:", data);
                setPostList((prev) => (page === 0 ? data.posts : [...prev, ...data.posts]));
                setHasMore(data.hasMore);
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
