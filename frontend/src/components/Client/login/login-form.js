import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import userServices from "../../../services/userServices";
import { AppContext } from "../../../App";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  const { setIsUserLogin, setOnLoading } = useContext(AppContext);
  const [userInformation, setUserInformation] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setOnLoading(true);
    try {
      const response = await userServices.login(userInformation);
      if (response) {
        setIsUserLogin(true);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOnLoading(false);
    }
  };

  return (
    <>
      <div className="w-1/3">
        <form
          onSubmit={handleLogin}
          className="flex flex-col p-4 w-full h-full"
        >
          <h1 className="font-extrabold text-6xl text-[#43546F] mb-20">
            Log in
          </h1>
          {/* <!--Log in with Google--> */}
          <div className="flex py-4 px-10 items-center bg-white mb-10 border border-transparent rounded-lg hover:scale-105 hover:shadow-lg duration-200">
            <i className="fa-brands fa-google text-xl text-[#43546F] text-left"></i>
            <p className="text-lg text-[#43546F] text-center mx-auto font-bold cursor-pointer">
              Login with Google
            </p>
          </div>
          {/* <!--Log in form--> */}
          <div className="flex flex-col space-y-10 mb-3">
            <input
              value={userInformation.email}
              onChange={(e) =>
                setUserInformation({
                  ...userInformation,
                  email: e.target.value,
                })
              }
              type="email"
              placeholder="name@gmail.com"
              className="p-4 text-lg text-#43546F max-w-md border border-gray-400 rounded-lg bg-transparent"
            />
            {/* <input type="password" name="" id="" /> */}
            <input
              value={userInformation.password}
              onChange={(e) =>
                setUserInformation({
                  ...userInformation,
                  password: e.target.value,
                })
              }
              type="password"
              name="password"
              placeholder="Enter your password"
              className="p-4 text-lg text-#43546F max-w-md border border-gray-400 rounded-lg bg-transparent"
            />
          </div>

          {/* <!--Forget Password--> */}
          <div className="flex space-x-10 justify-between items-center mb-10">
            <Link to={"/forgot-password"}>
              <p className="text-[#43546F] text-sm font-bold hover:text-[#ff6e6c]">
                Forget Password?
              </p>
            </Link>
            <label className="flex space-x-2 justify-center items-center">
              <input
                type="checkbox"
                value="stay-login"
                className="w-5 h-5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm">Stay Login</span>
            </label>
          </div>

          {/* <!--Login Button--> */}
          <button
            type="submit"
            className="flex justify-around items-center bg-[#3D5A86] text-white text-2xl font-bold py-3 px-4 rounded-md hover:brightness-125 hover:shadow-lg"
          >
            Log in <i className="fa-solid fa-play text-lg"></i>
          </button>
          <div className="flex items-center space-x-2 mx-auto mt-10">
            <p className="text-sm flex">Don't have account yet?</p>
            <Link to={"/signup"}>
              <p className="font-bold text-sm text-[#43546F] hover:text-[#ff6e6c]">
                Sign up
              </p>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
