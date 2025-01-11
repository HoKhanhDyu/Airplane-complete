import { useState, useRef } from "react";
import forgotPassService from "../../../services/forgotPassService";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
    const navigate = useNavigate();
    
    const [status, setStatus] = useState(false);
    const [isCode, setCodeStatus] = useState(false);
    const [message, setMessage] = useState('Enter your email to reset your password');
    const [notice, setNotice] = useState('');
    const [noticeSlide, setNoticeSlide] = useState(false);
    const [noticeMessage, setNoticeMessage] = useState('');
    const emailRef = useRef(null);
    const codeRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPassword = useRef(null);
    const [emailUser, setEmailUser] = useState('');

    const handleSendEmail = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        if (email === '') {
            setNotice('Please enter your email');
        } else {
            setMessage('Sending email...');
            setEmailUser(email);
            await forgotPassService.sendOTP({ email });
            setNotice('');
            setTimeout(() => {
                setStatus(true);
                setMessage('Enter the code to reset your password');
            }, 3000);
        }
    }

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        const code = codeRef.current.value;
        if (code === '') {
            setNotice('Please enter the code');
        } else {
            try{
            setMessage('Verifying code...');
            setNotice('');
            await forgotPassService.verifyOTP({ email: emailUser, otp: code });
            setCodeStatus(true);
            setNoticeSlide(true);
            setNoticeMessage('Verify code successfully');
            setTimeout(() => {
                setNoticeSlide(false);
            }, 2000);
            }
                catch (error) {
                    setNotice('Invalid code');
                    setMessage('Enter the code to reset your password');
                };
        }
    }

    const handlResetPassword = async (e) => {
        e.preventDefault();
        const password = passwordRef.current.value;
        const confirm = confirmPassword.current.value;
        if (password === '' || confirm === '') {
            setNotice('Please enter your password');
        } else {
            if (password !== confirm) {
                setNotice('Passwords do not match');
            } else {
                setNotice('');
                // Reset password in database
                await forgotPassService.resetPassword({ email: emailUser, password });
                setTimeout(() => {
                    setNoticeSlide(true);
                    setNoticeMessage('Password reset successfully');
                    setTimeout(() => {
                        setNoticeSlide(false);
                    }, 2000);
                }, 1000);
                navigate('/login');
            }
        }
    }

    return (
        <>
            {noticeSlide && (
                <div className="absolute flex justify-center items-center p-2 bg-green-600 rounded-b-lg top-0 left-1/2 transform -translate-x-1/2 w-1/2 z-50">
                    <p className="text-white text-center text-xl">{noticeMessage}</p>
                </div>
            )}
            <div className="w-1/3 space-y-20 -mt-20">
                {!isCode && (
                    <div className="space-y-5">
                        <h1 className="text-6xl text-[#43546F] font-bold">Forgot Password</h1>
                        <p className="text-center">{message}</p>
                    </div>
                )}
                {isCode && (
                    <div className="space-y-5">
                        <h1 className="text-6xl text-[#43546F] font-bold">Reset Password</h1>
                    </div>
                )}
                {!status && !isCode && (
                    <form className="space-y-10">
                        <div>
                            <input ref={emailRef} type="email" name="resetEmail" id="resetEmail" placeholder="example@gmail.com" className="p-3 text-lg text-[#43546F] max-w-md border border-gray-400 rounded-lg bg-transparent" />
                        </div>
                        <button onClick={handleSendEmail} className="flex justify-around items-center bg-[#3D5A86] text-white text-2xl font-bold py-3 px-4 rounded-md hover:brightness-125 hover:shadow-lg w-1/2">
                            <p>Send code</p>
                            <i className="fa-solid fa-play text-lg"></i>
                        </button>
                        <p className="text-center text-red-600">{notice}</p>
                    </form>
                )}
                {status && !isCode && (
                    <form className="space-y-10">
                        <div className="flex flex-col">
                            <label>Code</label>
                            <input ref={codeRef} type="text" name="resetCode" id="resetCode" className="p-3 text-lg text-[#43546F] max-w-md border border-gray-400 rounded-lg bg-transparent" />
                        </div>
                        <button onClick={handleVerifyCode} className="flex justify-around items-center bg-[#3D5A86] text-white text-2xl font-bold py-3 px-4 rounded-md hover:brightness-125 hover:shadow-lg w-1/2">
                            <p>Verify</p>
                            <i className="fa-solid fa-play text-lg"></i>
                        </button>
                        <p className="text-center text-red-600">{notice}</p>
                    </form>
                )}
                {isCode && (
                    <form className="space-y-10">
                    <div className="flex flex-col">
                        <label>New Password</label>
                        <input ref={passwordRef} type="text" name="resetPassword" id="resetPassword" className="p-3 text-lg text-[#43546F] max-w-md border border-gray-400 rounded-lg bg-transparent" />
                    </div>
                    <div className="flex flex-col">
                        <label>Confirm Password</label>
                        <input ref={confirmPassword} type="text" name="confirmPassword" id="confirmPassword" className="p-3 text-lg text-[#43546F] max-w-md border border-gray-400 rounded-lg bg-transparent" />
                    </div>
                    <button onClick={handlResetPassword} className="flex justify-around items-center bg-[#3D5A86] text-white text-2xl font-bold py-3 px-4 rounded-md hover:brightness-125 hover:shadow-lg w-1/2">
                        <p>Verify</p>
                        <i className="fa-solid fa-play text-lg"></i>
                    </button>
                    <p className="text-center text-red-600">{notice}</p>
                </form>
                )}
            </div>
        </>
    )
}

export default ForgotPasswordForm;