import React from "react";
import css from "./CreatePost.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import QuillEditor from "../components/QuillEditor";
import { type } from "./../../node_modules/eventemitter3/index.d";
const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [files, setFiles] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const user = useSelector((state) => state.user.user);
    //사용자 정보가 없으면 로그인 페이지로 리디렉션
    useEffect(() => {
        if (!user || !user.userName) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleContentChange = (content) => {
        setContent(content);
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        console.log("제출");
        console.log(files); //배열 정보 확인

        setIsSubmitting(true);
        setError("");

        if (!title || !summary || !content) {
            setIsSubmitting(false);
            setError("모든 필드를 입력해주세요");
            return;
        }

        //백엔드로 전송할 데이터 생성
        const data = new FormData();
        data.set("title", title);
        data.set("summary", summary);
        data.set("content", content);

        if (files[0]) {
            data.set("files", files[0]);
        }

        try {
            console.log("등록 성공");
            setIsSubmitting(false);
            navigate("/");
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
            setError("");
        }
    };
    return (
        <main className={css.createPost}>
            <h2>글쓰기</h2>
            {error && <div className={css.error}>{error}</div>}
            <form action="" className={css.writeCon} onSubmit={handleCreatePost}>
                <label htmlFor="title">제목</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="제목을 입력해주세요"
                    value={value}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </form>
            <label htmlFor="summary">요약내용</label>
            <input
                type="text"
                id="summary"
                name="summary"
                placeholder="요약내용을 입력해주세요"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
            />
            <label htmlFor="content">내용</label>
            <div className={css.editorWrapper}>
                <QuillEditor
                    value={content}
                    onChange={handleContentChange}
                    placeholder="내용을 입력해주세요"
                />
            </div>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "등록중..." : "등록"}
            </button>
            <div>test</div>
        </main>
    );
};

export default CreatePost;
