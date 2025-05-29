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

    // 페이지네이션을 위한 상태 추가
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const listRef = useRef(null);
    const observer = useRef();

    // 마지막 게시물 요소를 감지하는 ref 콜백
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
        console.log("=== useEffect 시작 ===");
        console.log("현재 page:", page);
        console.log("현재 isLoading:", isLoading);

        const fetchPostList = async () => {
            console.log("=== fetchPostList 시작 ===");
            try {
                // 페이지가 0보다 크면 추가 데이터 로딩
                if (page > 0) {
                    console.log("페이지 > 0, 로딩 상태 true로 설정");
                    setIsLoading(true);
                }

                console.log("API 호출 시작 - getPostList(", page, ")");

                // API 호출
                const data = await getPostList(page);

                console.log("API 응답 받음:", data);
                console.log("data.posts:", data.posts);
                console.log("data.hasMore:", data.hasMore);

                // 상태 업데이트
                setPostList((prev) => {
                    const newList = page === 0 ? data.posts : [...prev, ...data.posts];
                    console.log("새로운 postList:", newList);
                    return newList;
                });

                setHasMore(data.hasMore);
                console.log("hasMore 설정:", data.hasMore);
            } catch (error) {
                console.error("=== API 호출 에러 ===");
                console.error("에러 상세:", error);
                console.error("에러 메시지:", error.message);
                console.error("에러 스택:", error.stack);

                setError("글 목록을 불러오는데 실패했습니다.");
            } finally {
                console.log("=== finally 블록 실행 ===");
                console.log("로딩 상태를 false로 설정");
                setIsLoading(false);
            }
        };

        fetchPostList();
    }, [page]);

    console.log("=== 렌더링 시점 상태 ===");
    console.log("postList:", postList);
    console.log("isLoading:", isLoading);
    console.log("error:", error);
    console.log("page:", page);

    return (
        <main className={css.postListPage}>
            <h2>글목록</h2>
            {error && <p className={css.errorMessage}>{error}</p>}
            {isLoading && page === 0 ? (
                <p>로딩중...</p>
            ) : postList.length === 0 ? (
                <p className={css.noPostMessage}>첫번째 글의 주인공이 되어주세요</p>
            ) : (
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
