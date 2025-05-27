import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../common/DefaultLayout";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import PostListPage from "../pages/PostListPage";
import PostDetailPage from "../pages/PostDetailPage";
import EditPost from "../pages/EditPost";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        errorElement: <div>에러</div>,
        children: [
            {
                index: true,
                element: <div>블로그 리스트</div>,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/card",
                element: <PostListPage />,
            },
            {
                path: "/detail",
                element: <EditPost />,
            },
        ],
    },
]);
