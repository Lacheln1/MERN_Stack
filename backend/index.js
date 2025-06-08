//dotenv 패키지를 사용하여 환경변수 설정
import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
const port = process.env.PORT || 3000; // 3000으로 변경 (프론트엔드와 맞춤)

import cors from "cors";
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173", //클라이언트 url 명시
        credentials: true, // true로 유지해야 쿠키가 전송된다
        methods: ["GET", "POST", "PUT", "DELETE"], // "GETS" → "GET" 수정
        allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더를 명시할 수 있음
    })
);
app.use(express.json());

import cookieParser from "cookie-parser";
app.use(cookieParser());

import mongoose from "mongoose";
import { userModel } from "./model/user.js";
mongoose
    .connect(process.env.MONGODB_URI, {
        dbName: process.env.MONGODB_DB_NAME, // 환경변수 적용
    })
    .then(() => {
        console.log("MongDB 연결됨");
    })
    .catch((err) => {
        console.log("MongoDB 연결 안됨", err);
    });

app.listen(port, () => {
    console.log(`서버가 포트 ${port}번에서 실행 중입니다`);
});

import bcrypt from "bcryptjs";
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET;
const tokenLife = process.env.JWT_EXPIRATION; // 토큰 유효시간

//쿠키 옵션을 일관되게 유지하기 위한 상수 정의
const cookieOptions = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1시간
    secure: process.env.NODE_ENV === "production", // https에서만 쿠키 전송
    sameSite: "strict", //CSRF 방지
    path: "/", //모든 경로에서 쿠키 접근 가능
};

// 회원가입 로직
app.post("/register", async (req, res) => {
    try {
        console.log("------", req.body);
        const { userName, passWord } = req.body;

        const existingUser = await userModel.findOne({ userName });
        if (existingUser) {
            return res.status(409).json({ error: "이미 존재하는 아이디입니다" });
        }

        const userDoc = new userModel({
            userName,
            passWord: bcrypt.hashSync(passWord, saltRounds),
        });
        const savedUser = await userDoc.save();

        res.status(201).json({
            msg: "회원가입 성공",
            userName: savedUser.userName,
        });
    } catch (error) {
        console.log("에러", error); // err → error 수정
        res.status(500).json({ error: "서버 에러" });
    }
});

// 로그인 로직
app.post("/login", async (req, res) => {
    try {
        const { userName, passWord } = req.body;
        const userDoc = await userModel.findOne({ userName });
        if (!userDoc) {
            return res.status(401).json({ error: "없는 사용자 입니다" });
        }

        const passOk = bcrypt.compareSync(passWord, userDoc.passWord);
        if (!passOk) {
            return res.status(401).json({ error: "비밀번호가 틀렸습니다" });
        } else {
            const { _id, userName } = userDoc;
            const payload = { id: _id, userName };
            const token = jwt.sign(payload, secretKey, {
                expiresIn: tokenLife,
            });

            //쿠키에 토큰 저장
            res.cookie("token", token, cookieOptions).json({
                id: userDoc._id,
                userName,
            });
        }
    } catch (error) {
        console.error("로그인 오류:", error);
        res.status(500).json({ error: "로그인 실패" });
    }
});

//회원정보 조회
app.get("/profile", (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.json({ error: "로그인 필요" });
    }
    jwt.verify(token, secretKey, (err, info) => {
        if (err) {
            return res.json({ error: "로그인 필요" });
        }
        res.json(info);
    });
});

//로그아웃
app.post("/logout", (req, res) => {
    // 쿠키 옵션을 로그인과 일관되게 유지하되, maxAge만 0으로 설정
    const logoutCookieOptions = {
        ...cookieOptions,
        maxAge: 0,
    };
    res.cookie("token", "", logoutCookieOptions).json({ message: "로그아웃 되었음" });
});

import multer from "multer";
import path from "path";
import fs from "fs";
import { postModel } from "./model/post.js";
import { fileURLToPath } from "url";

//__dirname설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//uploads폴더의 파일들을 /uploads 경로로 제공
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//정적 파일 접근 시 CORS 오류를 방지하기 위한 설정
app.get("/uploads/:filename", (req, res) => {
    const { filename } = req.params;
    res.sendFile(path.join(__dirname, "uploads", filename));
});

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

//multer을 사용할 때 파일 업로드를 디스크에 저장하는 방식을 설정
//destination : 어디에 저장할지  filename: 어떤이름으로 저장할지
const storage = multer.diskStorage({
    // 업로드된 파일을 uploads/ 폴더에 저장하겠다는 의미. cb(null, ...)은 콜백 함수로, 에러가 없으니 null, 경로는 "uploads/" 폴더 반드시 존재해야함 안그러면 에러
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    // 업로드된 파일의 이름을 타임스탬프-랜덤숫자.확장자 형식으로 저장하겠다는 뜻.
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

//글 작성
app.post("/postWrite", upload.single("files"), async (req, res) => {
    console.log("폼 데이터:", req.body); // title, summary, content
    console.log("파일 정보:", req.file); // 업로드된 단수 파일 정보

    const postData = {
        title: req.body.title,
        summary: req.body.summary,
        content: req.body.content,
        file: req.file // req.files → req.file 수정
            ? {
                  originalname: req.file.originalname, // req.files → req.file
                  size: req.file.size,
                  mimetype: req.file.mimetype,
              }
            : null,
    };
    res.json({ message: "포스트 글쓰기 성공" });
});

// 글 목록 조회 API - 페이지네이션 추가 (수정됨)
app.get("/posts", async (req, res) => {
    try {
        console.log("글 목록 조회 API 호출됨");
        console.log("쿼리 파라미터:", req.query);

        const page = parseInt(req.query.page) || 0; //페이지 번호 0부터 시작
        const limit = parseInt(req.query.limit) || 3; //한 페이지당 게시물 수 (기본값 3)
        const skip = page * limit; // 건너뛸 게시물 수

        //총 게시물 조회
        const total = await postModel.countDocuments();
        console.log("총 게시물 수:", total);

        //페이지네이션 적용하여 게시물 조회
        const posts = await postModel
            .find()
            .sort({ createdAt: -1 }) // createAt → createdAt 수정
            .skip(skip)
            .limit(limit);

        console.log("조회된 게시물:", posts);

        // 다음 페이지가 있는지 확인
        const hasMore = skip + limit < total;

        // 응답 데이터 구성
        const responseData = {
            posts: posts,
            hasMore: hasMore,
            totalCount: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };

        console.log("응답 데이터:", responseData);

        // 응답 보내기 (이 부분이 빠져있었음!)
        res.json(responseData);
    } catch (error) {
        console.error("게시물 조회 오류", error);
        res.status(500).json({ error: "게시물 조회에 실패했습니다" });
    }
});

// 글 상세조회 API
app.get("/post/:postId", async (req, res) => {
    // "post/:postId" → "/post/:postId" (앞에 / 추가)
    try {
        const { postId } = req.params;
        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "게시물을 찾을 수 없습니다" });
        }

        //댓글 수 조회
        const commentCount = await commentModel.countDocuments({ postId });

        //응답 객체 생성
        const postWithCommentCount = post.toObject();
        postWithCommentCount.commentCount = commentCount;

        res.json(postWithCommentCount);
    } catch (error) {
        console.error("게시물 상세 조회 오류:", error);
        res.status(500).json({ error: "게시물 상세 조회에 실패했습니다" });
    }
});

// 글 삭제 API
app.delete("/post/:postId", async (req, res) => {
    try {
        const { postId } = req.params; // useParams → req.params 수정
        const post = await postModel.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).json({ error: "게시물을 찾을 수 없습니다" });
        }
        res.json({ message: "게시물이 삭제되었습니다" });
    } catch (error) {
        console.error("게시물 삭제 오류", error);
        res.status(500).json({ error: "게시물 삭제에 실패했습니다" });
    }
});

// 글 수정 API
app.put("/post/:postId", upload.single("files"), async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, summary, content } = req.body;
        const { token } = req.cookies;

        //로그인 확인
        if (!token) {
            return res.status(401).json({ error: "로그인 필요" });
        }

        //토큰 검증
        const userInfo = jwt.verify(token, secretKey);

        //게시글 조회
        const post = await postModel.findById(postId);

        //게시물이 존재하지 않을 경우
        if (!post) {
            return res.status(404).json({ error: "게시물을 찾을 수 없습니다" });
        }

        //작성자 확인 (자신의 글만 수정 가능)
        if (post.author !== userInfo.userName) {
            return res.status(403).json({ error: "자신의 글만 수정할 수 있습니다" });
        }

        //수정할 데이터 객체 생성
        const updateData = {
            title,
            summary,
            content,
        };

        //새 파일이 업로드 된 경우 파일 경로 업데이트
        if (req.file) {
            updateData.cover = req.file.path;
        }

        //게시물 업데이트
        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            updateData,
            { new: true } // ture → true 수정
        );

        res.json({
            message: "게시물이 수정되었습니다",
            post: updatedPost,
        });
    } catch (error) {
        console.error("게시물 수정 오류", error); // err → error 수정
        res.status(500).json({ error: "게시물 수정에 실패했습니다" });
    }
});

// 댓글 관련 api
import { commentModel } from "./model/comment.js";

// 댓글 작성 API
app.post("/comments", async (req, res) => {
    const { content, author, postId } = req.body;

    try {
        const newComment = await commentModel.create({
            content,
            author,
            postId,
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error("댓글 작성 오류:", error);
        res.status(500).json({ error: "댓글 작성에 실패했습니다." });
    }
});

// 댓글 삭제 기능
app.delete("/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await commentModel.findByIdAndDelete(commentId);
        if (!comment) {
            return res.status(404).json({ messgae: "댓글을 찾을 수 없습니다" });
        }
        res.json({ messgae: "댓글이 삭제되었습니다" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 에러" });
    }
});

//comments count 반영
app.get("/postlist", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0; //페이지번호 0부터 시작
        const limit = parseInt(req.query.limit) || 3; //한 페이지당 게시물 수
        const skip = page * limit; //건너뛸 게시물 수

        //총 게시물 조회
        const total = await postModel.countDocuments();

        //페이지네이션 적용하여 게시물 조회
        const posts = await postModel
            .find()
            .sort({ createdAt: -1 }) //최신순 정렬
            .skip(skip)
            .limit(limit);

        //각 포스트의 댓글 수 조회
        const postsWithCommentCounts = await Promise.all(
            posts.map(async (post) => {
                const commentCount = await commentModel.countDocuments({ postId: post._id });
                const postObject = post.toObject(); //toObject : 몽구스 document를 일반 js객체로 변환. 객체로 변환하여 자유롭게 수정 가능 commentCount라는 새로운 속성을 추가하기 위해 일반 객체로 변환
                postObject.commentCount = commentCount;
                return postObject;
            })
        );

        //마지막 페이지 여부 확인
        const hasMore = total > skip + posts.length;

        res.json({
            posts: postsWithCommentCounts,
            hasMore,
            total,
        });
    } catch (error) {
        console.error("게시물 조회 오류", error);
        res.status(500).json({ error: "게시물 조회에 실패했습니다" });
    }
});

//사용자 정보 조회 api
app.get("/user/:username", async (req, res) => {
    try {
        const { userName } = req.params;
        const posts = await postModel.find({ author: userName }).sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error("사용자 게시물 조회 오류:", error);
        res.status(500).json({ error: "사용자 게시물 조회에 실패했습니다" });
    }
});

//사용자가 작성한 댓글 조회 api
app.get("/user/:username/comments", async (req, res) => {
    try {
        const { userName } = req.params;
        const comments = await commentModel.find({ author: userName }).sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error("사용자 댓글 조회 오류:", error);
        res.status(500).json({ error: "사용자 댓글 조회에 실패했습니다" });
    }
});

//사용자가 좋아요 클릭한 글 조회 api
app.get("/user/:username/likes", async (req, res) => {
    try {
        const { userName } = req.params;
        //먼저 사용자 id찾기
        const user = await userModel.findOne({ userName });

        if (!user) {
            return res.status(404).json({ error: "사용자를 찾을 수 없습니다" });
        }

        //사용자가 좋아요한 게시물 찾기
        const likedPosts = await postModel.find({ likes: user._id }).sort({ createdAt: -1 });
        res.json(likedPosts);
    } catch (error) {
        console.error("사용자 좋아요 게시물 조회 오류:", error);
        res.status(500).json({ error: "사용자 좋아요 게시물 조회에 실패했습니다" });
    }
});
