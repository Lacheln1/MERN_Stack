import React, { useEffect, useState } from "react";
import css from "./PostDetailPage.module.css";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { deletePost, getPostDetail } from "../apis/postApi";
import { formatDate } from "../utils/features";
import LikeButton from "../components/LikeButton";
import Comments from "../components/Comments";
const PostDetailPage = () => {
    const { postId } = useParams();
    const userName = useSelector((state) => state.user.user.userName);
    const [postInfo, setPostInfo] = useState();

    //댓글 수 상태 관리
    const [commentCount, setCommentCount] = useState(0);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const data = await getPostDetail(postId);
                console.log(data);
                setPostInfo(data);
                //초기 댓글 수 설정(백엔드에서 전달받은 경우)
                setCommentCount(data.commentCount || 0);
            } catch (error) {
                console.error("상세정보 조회 실패", error);
            }
        };
        fetchPostDetail();
    }, [postId]);

    //댓글 수를 업데이트 하는 함수
    const updateCommentCount = (count) => {
        setCommentCount(count);
    };

    const handleDeletePost = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await deletePost(postId);
                alert("삭제되었습니다");
                window.location.href = "/";
            } catch (error) {
                console.error("글 삭제 실패", error);
                alert("삭제에 실패했습니다");
            }
        }
    };
    return (
        <main className={css.postDetailPage}>
            <h2>블로그 상세 페이지</h2>
            <section>
                <div className={css.detailimg}>
                    {/* <img src={`${import.meta.env.VITE_BACK_URL}/${postInfo?.cover}`} alt="" /> */}
                    <img src="../tabi.jpg" alt="" />
                    <h3>{postInfo?.title}</h3>
                </div>
                <div className={css.info}>
                    <p className={css.author}>{postInfo?.author}</p>
                    <p className={css.date}>{formatDate(postInfo?.updatedAt)}</p>
                    <p>
                        {postInfo && <LikeButton postId={postId} likes={postInfo.likes} />}
                        <span style={{ marginLeft: "10px" }}>💬 {commentCount}</span>
                    </p>
                </div>
                <div className={css.summary}>{postInfo?.summary}</div>
                {/* quill 에디터로 작성된 html 콘텐츠를 렌더링  */}
                <div
                    className={`${css.content} ql-content`}
                    dangerouslySetInnerHTML={{ __html: postInfo?.content }}
                ></div>
            </section>

            <section className={css.btns}>
                {/* 로그인한 사용자만 그을 수정,삭제 가능 */}
                {userName === postInfo?.author && (
                    <>
                        <Link to={`/edit/${postId}`}>수정</Link>
                        <span onClick={handleDeletePost}>삭제</span>
                    </>
                )}
                <Link to={"/"}>목록으로</Link>
            </section>
            <Comments
                postId={postId}
                commentCount={commentCount}
                onCommentCountChange={updateCommentCount}
            />
        </main>
    );
};

export default PostDetailPage;
