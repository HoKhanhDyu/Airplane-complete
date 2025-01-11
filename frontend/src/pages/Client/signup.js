import SignupHeader from "../../components/Client/signup/signup-header";
import SignupForm from "../../components/Client/signup/signup-form";
import SignupDecoration from "../../components/Client/signup/signup-decoration";

const SignupPage = () => {
    return (
        <>
            <div className="bg-[#4F70A3] h-screen overflow-hidden">
                <section id="sign-up"
                    className="relative flex flex-col justify-center items-center bg-white w-2/3 ml-auto border border-transparent rounded-s-xl py-4 h-screen">
                    <SignupHeader />
                    <SignupForm />
                </section>
                <SignupDecoration />
            </div>
        </>
    )
}

export default SignupPage;