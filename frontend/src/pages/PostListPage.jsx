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
        const fetchPostList = async () => {
            try {
                // 페이지가 0보다 크면 추가 데이터 로딩
                if (page > 0) {
                    setIsLoading(true);
                }
                // API 호출
                const data = await getPostList(page);

                // 상태 업데이트
                setPostList((prev) => {
                    const newList = page === 0 ? data.posts : [...prev, ...data.posts];
                    return newList;
                });

                setHasMore(data.hasMore);
            } catch (error) {
                console.error("=== API 호출 에러 ===");
                console.error("에러 상세:", error);
                setError("글 목록을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPostList();
    }, [page]);

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
