// components/LikeButton.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toggleLike } from "../apis/postApi";
import { useSelector } from "react-redux";

export default function LikeButton({ postId, likes, className = "" }) {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const userId = user?.id; // 현재 로그인한 사용자의 ID

    // 초기 상태를 설정할 때 로그인한 사용자가 이미 좋아요를 눌렀는지 확인
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(likes ? likes.length : 0);

    // 컴포넌트 마운트 시 및 likes나 userId가 변경될 때 좋아요 상태를 확인
    useEffect(() => {
        if (userId && likes) {
            // 사용자가 로그인 상태이고, 게시물에 좋아요 배열이 있을 경우
            const userLiked = likes.includes(userId);
            setIsLiked(userLiked);
        } else {
            setIsLiked(false);
        }

        // likes 배열이 변경될 때마다 카운트 업데이트
        setLikesCount(likes ? likes.length : 0);
    }, [likes, userId]);

    const handleLikeToggle = async (e) => {
        e.stopPropagation(); // 이벤트 전파를 막습니다

        try {
            // 좋아요 토글 API 호출
            const updatedPost = await toggleLike(postId);

            // 상태 업데이트
            setIsLiked((prevIsLiked) => !prevIsLiked);
            setLikesCount(updatedPost.likes.length);
        } catch (error) {
            console.error("좋아요 토글 실패:", error);

            // 로그인이 필요한 경우 로그인 페이지로 이동
            if (error.response && error.response.status === 401) {
                alert("로그인이 필요합니다.");
                navigate("/login");
            }
        }
    };

    return (
        <span className={className}>
            <span onClick={handleLikeToggle} style={{ cursor: "pointer" }}>
                {isLiked ? "❤️" : "🤍"}
            </span>
            <span>{likesCount}</span>
        </span>
    );
}
