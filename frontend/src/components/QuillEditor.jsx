import React from "react";
import "react-quill-new/dist/quill.snow.css";
import "./QuillEditor.css";
import { useRef } from "react";
import ReactQuill from "./../../node_modules/react-quill-new/lib/index";
const QuillEditor = ({ value, onChange, placeholder }) => {
    const quillRef = useRef(null);

    //quill 에디터 모듈 설정
    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
            ],
        },
    };
    return (
        <div className="quill-editor-container">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                placeholder={placeholder || "내용을 입력해 주세요"}
            />
        </div>
    );
};

export default QuillEditor;
