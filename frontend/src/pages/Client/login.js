import LoginHeader from "../../components/Client/login/login-header";
import LoginForm from "../../components/Client/login/login-form";
import LoginDecoration from "../../components/Client/login/login-decoration";

const LoginPage = () => {
    return (
        <>
            <div className="bg-gray-50 h-screen overflow-hidden">
                <LoginHeader />
                <section id="login-form" class="flex items-center max-h-screen">
                    <div className="flex justify-center items-center -space-x-28 w-full">
                        <LoginForm />
                        <LoginDecoration />
                    </div>
                </section>
            </div>
        </>
    )
}

export default LoginPage;