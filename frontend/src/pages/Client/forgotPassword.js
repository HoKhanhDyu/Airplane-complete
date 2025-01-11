import LoginHeader from "../../components/Client/login/login-header";
import ForgotPasswordForm from "../../components/Client/login/forgot-password-form";
import LoginDecoration from "../../components/Client/login/login-decoration";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
    return (
        <>
            <div className="bg-gray-50 h-screen overflow-hidden">
                <LoginHeader />
                <Link to={'/login'} className="z-100 relative hover:text-red-500">
                    <button className="flex space-x-4 items-center ml-10 cursor-pointer">
                        <i className="fa-solid fa-arrow-left text-xl"></i>
                        <p className="text-xl">Back</p>
                    </button>
                </Link>
                <section className="flex items-center max-h-screen">
                    <div className="flex justify-center items-center space-x-14 w-full">
                        <ForgotPasswordForm />
                        <LoginDecoration />
                    </div>
                </section>
            </div>
        </>
    )
}

export default ForgotPasswordPage;