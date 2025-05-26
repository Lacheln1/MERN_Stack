//dotenv 패키지를 사용하여 환경변수 설정
import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
const port = process.env.PORT || 4000; //환경변수 PORT가 없으면 4000으로 설정

import cors from "cors";
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173", //클라이언트 url 명시
        credentials: true, // true로 유지해야 쿠키가 전송된다
        methods: ["GETS", "POST", "PUT", "DELETE"], // 허용할 HTTP 메서드를 명시할 수 있음
        allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더를 명시할 수 있음
    })
);
app.use(express.json());

import cookieParser from "cookie-parser";
app.use(cookieParser());

import mongoose from "mongoose";
import { userModel } from "./model/user";
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

import bcrypt from "bcryptjs";
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET;
const tokenLife = process.env.JWT_EXPIRATION; // 토큰 유효시간

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
        console.log("에러", err);
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

            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60,
            }).json({
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
    res.cookie("token", "", {
        httpOnly: true,
        maxAge: 0, //쿠키 만료
    }).json({ message: "로그아웃 되었음" });
});
