import { useParams } from "react-router-dom";
import css from "./userpage.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserComments, getUserInfo, getUserLikes, getUserPosts } from "../apis/userApi";
import { formatDate } from "../utils/features";

export const UserPage = () => {
    const { userName } = useParams();
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [userComments, setUserComments] = useState([]);
    const [userLikes, setUserLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //현재 로그인한 사용자 정보
    const currentUser = useSelector((state) => state.user.user);
    const isCurrentUser = currentUser && currentUser.userName === userName;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);

                //api호출을 통해 데이터 가져오기
                const userData = await getUserInfo(userName);
                const postsData = await getUserPosts(userName);
                const commentsData = await getUserComments(userName);
                const likesData = await getUserLikes(userName);

                setUserData(userData);
                setUserPosts(postsData);
                setUserComments(commentsData);
                setUserLikes(likesData);
                setLoading(false);
            } catch (error) {
                console.error("사용자 데이터 로딩실패:", error);
                setError("사용자 정보를 불러오는데 실패했습니다");
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userName]);
    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (!userData) return <div>사용자를 찾을 수 없습니다.</div>;
    return (
        <main className={css.userpage}>
            <h2>{userName}님의 페이지</h2>

            <section>
                <h3>사용자 정보</h3>
                <div className={css.userInfo}>
                    <p>
                        <strong>사용자 이름:</strong> {userData.userName}
                    </p>
                    <p>
                        <strong>가입일:</strong> {formatDate(userData.createdAt)}
                    </p>
                    {isCurrentUser && (
                        <div className={css.editButton}>
                            <Link to={``}>내 정보 수정</Link>
                        </div>
                    )}
                </div>
            </section>

            <section>
                <h3>작성한 글 ({userPosts.length})</h3>
                {userPosts.length > 0 ? (
                    <ul className={css.postList}>
                        {userPosts.map((post) => (
                            <li key={post._id} className={css.postCard}>
                                <Link to={`/detail/${post._id}`}>
                                    <p className={css.title}>{post.title}</p>
                                    <p className={css.postDate}>{formatDate(post.createdAt)}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>작성한 글이 없습니다.</p>
                )}
            </section>

            <section>
                <h3>작성한 댓글 ({userComments.length})</h3>
                {userComments.length > 0 ? (
                    <ul className={css.commentList}>
                        {userComments.map((comment) => (
                            <li key={comment._id} className={css.commentCard}>
                                <p className={css.commentContent}>{comment.content}</p>
                                <div className={css.commentMeta}>
                                    <Link to={`/detail/${comment.postId}`}>원문 보기</Link>
                                    <p>작성일:{formatDate(comment.createdAt)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>작성한 댓글이 없습니다.</p>
                )}
            </section>

            <section>
                <h3>좋아요 클릭한 글 ({userLikes.length})</h3>
                {userLikes.length > 0 ? (
                    <ul className={css.likeList}>
                        {userLikes.map((post) => (
                            <li key={post._id} className={css.likeCard}>
                                <Link to={`/detail/${post._id}`}>
                                    {post.cover ? (
                                        <img
                                            src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`}
                                            alt={post.title}
                                        />
                                    ) : (
                                        <img
                                            src="https://picsum.photos/200/300"
                                            alt="기본 이미지"
                                        />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>좋아요 클릭한 글이 없습니다.</p>
                )}
            </section>
        </main>
    );
};
