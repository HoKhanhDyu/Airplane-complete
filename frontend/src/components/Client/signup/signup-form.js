import React, { useState, useContext, useRef, useEffect } from "react";

import { Link } from "react-router-dom";
import userServices from "../../../services/userServices";
import { AppContext } from "../../../App";
import "./sign-up.scss";
import { useNavigate } from "react-router-dom";
const SignupForm = () => {
    const navigate = useNavigate();

    const goToLoginPage = () => {
        navigate("/login");
    };

    const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const { setOnLoading } = useContext(AppContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("signupData", signupData);

    if (!signupData.email || !signupData.password || !signupData.name) {
      return;
    }
    setOnLoading(true);

    console.log("signupData", signupData);

    try {
      const res = await userServices.register(signupData);
      if (res) {
        console.log("res", res);
        setRegisterStep(2);

      }
    } catch (error) {
    } finally {
      setOnLoading(false);
    }
  };

  const [registerStep, setRegisterStep] = useState(1);
  const [otp, setOtp] = useState(new Array(6).fill(null));
  const inputRefs = useRef([]);

  const backToPreviousStep = () => {
    if (registerStep > 1) {
      setRegisterStep(registerStep - 1);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    console.log("otp", otp);
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      return;
    }
    console.log("otpCode", otpCode);
    setOnLoading(true);

    try {
        console.log("signupData", signupData);
      await userServices.verifyOTP({email: signupData.email,otp: otpCode});
      console.log("otpCode", otpCode);
        goToLoginPage();
    } catch (error) {
    } finally {
      setOnLoading(false);
    }
  };

  useEffect(() => {
    console.log("step", registerStep);
    }, [registerStep]);
  return (
    <>
      <div class="w-1/2 mt-10">
        {registerStep === 1 && (
          <form onSubmit={(e) => {handleSignup(e)}}>
            {/* <!--Sign up Header--> */}
            <div class="space-y-10 mb-8">
              <h1 class="text-5xl -ml-16 text-black font-bold tracking-wider">
                Create Account
              </h1>
              {/* <!--Sign up with Google--> */}
              <div class="flex w-3/4 py-2 px-2 space-x-10 justify-center items-center bg-transparent mx-auto mb-10 border border-[#4F70A3] rounded-lg cursor-pointer hover:scale-105 hover:shadow-lg duration-200">
                <i class="fa-brands fa-google text-xl text-[#43546F]"></i>
                <p class="text-lg text-[#43546F]">Sign up with Google</p>
              </div>
              <p class="text-2xl text-gray-400 mx-auto text-center">- OR -</p>
            </div>

            {/* <!--Information--> */}
            <div class="w-full flex flex-col space-y-12">
              <input
                type="text"
                placeholder="Full Name"
                class="border-b border-gray-400 py-2 text-left text-lg focus:outline-none"
                value={signupData.name}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    name: e.target.value,
                  })
                }
              />
              <input
                type="email"
                placeholder="Email Address"
                class="border-b border-gray-400 py-2 text-left text-lg focus:outline-none"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    email: e.target.value,
                  })
                }
              />
              <div class="flex justify-between items-center border-b border-gray-400 py-2">
                <input
                  type="password"
                  placeholder="Pasword"
                  class="text-left text-lg focus:outline-none"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      password: e.target.value,
                    })
                  }
                />
                <i class="fa-solid fa-eye-slash cursor-pointer"></i>
              </div>
            </div>

            {/* <!--Button & Login--> */}
            <div class="flex flex-col w-full mt-12">
              <button
                onClick={handleSignup}
                type="submit"
                class="text-center text-lg text-white font-bold py-3 bg-[#6492D9] w-full border border-transparent rounded-lg hover:brightness-90 hover:shadow-lg"
              >
                Create Account
              </button>
              <div class="flex space-x-2 mt-4 text-left">
                <p class="text-sm text-gray-400">Already have an account?</p>
                <Link to={"/login"}>
                  <p class="text-sm font-bold text-[#7CD2D7] hover:text-hoverText">
                    Login
                  </p>
                </Link>
              </div>
            </div>
          </form>
        )}

        {
          // <!--Step 2-->
          registerStep === 2 && (
            <form onSubmit={(e) => {handleVerifyOtp(e)}} className="confirm-otp-form">
              <div className="confirm-otp-form-inner">
                <h3 className="title">Verify OTP</h3>
                <p className="description">
                  To verify your email please enter the OTP sent to your gmail
                </p>
                <div className="list-otp-entry">
                  {otp.map((value, index) => {
                    return (
                      <input
                        type="number"
                        className="otp-entry"
                        maxLength="1" // Chỉ nhập 1 ký tự
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        value={value}
                        onChange={(e) => {
                          const inputVal = e.target.value;
                          if (!/^\d*$/.test(inputVal)) return; // Chỉ cho phép nhập số

                          const updatedOtp = [...otp];
                          updatedOtp[index] = inputVal.slice(-1); // Chỉ lấy ký tự cuối
                          setOtp(updatedOtp);

                          // Tự động chuyển focus sang ô tiếp theo nếu có giá trị
                          if (inputVal && index < otp.length - 1) {
                            inputRefs.current[index + 1].focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace") {
                            const updatedOtp = [...otp];

                            // Nếu ô hiện tại có giá trị, xóa nó
                            if (updatedOtp[index]) {
                              updatedOtp[index] = "";
                              setOtp(updatedOtp);
                            } else if (index > 0) {
                              // Nếu ô hiện tại rỗng, chuyển focus về ô trước đó
                              inputRefs.current[index - 1].focus();
                            }
                          }
                        }}
                      />
                    );
                  })}
                </div>
                <div className="resend-otp">
                  Have you received the code yet?{" "}
                  <button type="button" className="text-link">
                    Resend (30s)
                  </button>
                </div>
                <button
                  type="submit"
                  className="btn-verify"
                //   onClick={(e) => handleVerifyOtp(e)}
                >
                  Authenticate
                </button>
                <button
                  type="button"
                  onClick={backToPreviousStep}
                  className="back-text-link"
                >
                  Back to register
                </button>{" "}
              </div>
            </form>
          )
        }
      </div>
    </>
  );
};

export default SignupForm;
