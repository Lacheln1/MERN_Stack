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
