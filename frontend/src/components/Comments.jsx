import React from "react";
import css from "./Comments.module.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import { createComment } from "../apis/commentApi";
import { Link } from "react-router-dom";
const Comments = ({ postId }) => {
    //username을 prop으로 받아와서 사용 가능하고 store에서도 가져올수도있다
    const userInfo = useSelector((state) => state.user.user);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment) {
            alert("댓글을 입력하세요");
            return;
        }

        try {
            setIsLoading(true);

            //댓글 등록 api호출
            const commentData = {
                content: newComment,
                author: userInfo.userName,
                postId: postId,
            };

            const response = await createComment(commentData);
            console.log("댓글 등록 성공", response);

            setIsLoading(false);
        } catch (error) {
            console.error("댓글 등록 실패:", error);
            alert("댓글 등록에 실패했습니다.");
            setIsLoading(false);
        }
    };
    return (
        <section className={css.comments}>
            {userInfo.username ? (
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요"
                        disabled={isLoading}
                    ></textarea>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "등록 중..." : "댓글 등록"}
                    </button>
                </form>
            ) : (
                <p className={css.logMessage}>
                    댓글을 작성하려면 <Link to="/login">로그인이 필요합니다.</Link>
                </p>
            )}

            <ul>
                <li className={css.list}>
                    <div className={css.commnet}>
                        <p className={css.author}>username</p>
                        <p className={css.date}>2025-05-05</p>
                        <p className={css.text}>
                            로그인 한 사용자만 댓글을 작성할 수 있습니다. <br />
                            댓글은 다른 사용자에게 보여지며, 작성자만 댓글을 수정하거나 삭제할 수
                            있습니다.
                        </p>
                    </div>
                    <div className={css.btns}>
                        <button>수정</button>
                        <button>삭제</button>
                    </div>
                </li>
            </ul>
        </section>
    );
};

export default Comments;
