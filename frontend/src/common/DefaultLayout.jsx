import React from "react";
import css from "./DefaultLayout.module.css";
import Header from "../components/Header";
import "./index.css";
import { Outlet } from "react-router-dom";
const DefaultLayout = () => {
    return (
        <div className={css.defaultlayout}>
            <Header />
            <Outlet />
        </div>
    );
};

export default DefaultLayout;
