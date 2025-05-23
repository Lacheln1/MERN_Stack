import { useState } from "react";
import css from "./Header.module.css";
import { Link, NavLink } from "react-router-dom";
const Header = () => {
    const [isMenuActive, setIsMenuActive] = useState(false);

    const toggleMenu = () => {
        setIsMenuActive((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuActive(false);
    };
    return (
        <header className={css.header}>
            <h1>
                <Link to={"/"}>레헬 블로그</Link>
            </h1>
            <Hambuger isMenuActive={isMenuActive} toggleMenu={toggleMenu} />
            <nav className={css.gnbCon}>
                <div className={css.gnb}>
                    <MenuLike to="/register" label="회원가입" closeMenu={closeMenu} />
                    <MenuLike to="/login" label="로그인" closeMenu={closeMenu} />
                </div>
            </nav>
        </header>
    );
};

const MenuLike = ({ to, label, closeMenu }) => (
    <NavLink to={to} className={({ isActive }) => (isActive ? css.active : "")} onClick={closeMenu}>
        {label}
    </NavLink>
);

const Hambuger = ({ isMenuActive, toggleMenu }) => (
    <button className={`${css.hamburger} ${isMenuActive ? css.active : ""}`} onClick={toggleMenu}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-list"
            viewBox="0 0 16 16"
        >
            <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            />
        </svg>
    </button>
);

export default Header;
