import React from "react";
import css from "./Comments.module.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import { createComment, deleteComment, getComments } from "../apis/commentApi";
import { Link } from "react-router-dom";
import { useEffect } from "react";
const Comments = ({ postId }) => {
    //username을 prop으로 받아와서 사용 가능하고 store에서도 가져올수도있다
    const userInfo = useSelector((state) => state.user.user);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [editState, setEditState] = useState({ id: null, content: "" });

    const fetchComments = useCallback(async () => {
        try {
            const response = await getComments(postId);
            setComments(response);
        } catch (error) {
            console.error("댓글 목록 조회 실패:", error);
            alert("댓글 목록 조회에 실패했습니다.");
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            alert("댓글을 입력하세요");
            return;
        }

        try {
            setIsLoading(true);
            const commentData = {
                content: newComment,
                author: userInfo.username,
                postId,
            };

            const response = await createComment(commentData);
            setComments((prevComments) => [response, ...prevComments]);
            setNewComment("");
        } catch (error) {
            console.error("댓글 등록 실패:", error);
            alert("댓글 등록에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            setIsLoading(true);
            await deleteComment(commentId);
            setComments((prevComments) =>
                prevComments.filter((comment) => comment._id !== commentId)
            );
        } catch (error) {
            console.error("댓글 삭제 실패:", error);
            alert("댓글 삭제에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditMode = (comment) => {
        setEditState({ id: comment._id, content: comment.content });
    };

    const handleCancelEdit = () => {
        setEditState({ id: null, content: "" });
    };

    const handleUpdateComment = async (commentId) => {
        if (!editState.content.trim()) {
            alert("댓글 내용을 입력하세요");
            return;
        }

        try {
            setIsLoading(true);
            await updateComment(commentId, editState.content);

            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === commentId ? { ...comment, content: editState.content } : comment
                )
            );
            handleCancelEdit();
        } catch (error) {
            console.error("댓글 수정 실패:", error);
            alert("댓글 수정에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderCommentItem = (comment) => {
        const isEditing = editState.id === comment._id;
        const isAuthor = userInfo.username === comment.author;

        return (
            <li key={comment._id} className={css.list}>
                <div className={css.commnet}>
                    <p className={css.author}>{comment.author}</p>
                    <p className={css.date}>{formatDate(comment.createdAt)}</p>

                    {isEditing ? (
                        <textarea
                            value={editState.content}
                            onChange={(e) =>
                                setEditState({ ...editState, content: e.target.value })
                            }
                            className={css.text}
                            disabled={isLoading}
                        />
                    ) : (
                        <p className={css.text}>{comment.content}</p>
                    )}
                </div>

                {isEditing ? (
                    <div className={css.btns}>
                        <button
                            onClick={() => handleUpdateComment(comment._id)}
                            disabled={isLoading}
                        >
                            수정완료
                        </button>
                        <button onClick={handleCancelEdit} disabled={isLoading}>
                            취소
                        </button>
                    </div>
                ) : (
                    isAuthor && (
                        <div className={css.btns}>
                            <button onClick={() => handleEditMode(comment)}>수정</button>
                            <button onClick={() => handleDelete(comment._id)}>삭제</button>
                        </div>
                    )
                )}
            </li>
        );
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
                    />
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
                {comments.length > 0 ? (
                    comments.map(renderCommentItem)
                ) : (
                    <li className={css.list}>
                        <p className={css.text}>등록된 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
                    </li>
                )}
            </ul>
        </section>
    );
};

export default Comments;
