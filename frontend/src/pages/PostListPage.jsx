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
        console.log("=== useEffect 실행됨 ===");
        console.log("현재 page:", page);
        console.log("현재 isLoading:", isLoading);
        console.log("현재 hasMore:", hasMore);

        const fetchPostList = async () => {
            console.log("=== fetchPostList 함수 시작 ===");
            try {
                if (page > 0) setIsLoading(true);
                console.log("API 호출 시작 - page:", page);

                const data = await getPostList(page);
                console.log("API 응답 데이터:", data);

                setPostList((prev) => (page === 0 ? data.posts : [...prev, ...data.posts]));
                setHasMore(data.hasMore);
                console.log("상태 업데이트 완료");
            } catch (error) {
                console.error("목록조회 실패:", error);
                setError("글 목록을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
                console.log("=== fetchPostList 함수 종료 ===");
            }
        };
        fetchPostList();
    }, [page]);
    return (
        <main className={css.postlistpage}>
            <h2>글목록</h2>
            {error && <p className={css.errorMessage}>{error}</p>}
            {isLoading && page === 0 ? (
                <p>로딩중...</p>
            ) : postList.length === 0 ? (
                <p className={css.noPostMessage}>첫번째 글의 주인공이 되어주세요</p>
            ) : (
                // ref
                <ul className={css.postList} ref={listRef}>
                    {postList.map((post, i) => (
                        <li
                            key={post._id}
                            ref={i === postList.length - 1 ? lastPostElementRef : null}
                        >
                            <PostCard post={post} />
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default PostListPage;
