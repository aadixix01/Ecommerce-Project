import React, { useState } from "react";
import { auth } from "../servies/image.services";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";

const AuthPage = () => {
  const [eye, setEye] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen grid xl:grid-cols-[55%_1fr] lg:grid-cols-[50%_1fr] bg-white">
      <div className="w-full flex items-center justify-center">
        <img
          src={auth.login}
          alt="Auth Illustration"
          className="w-[70%] object-contain"
        />
      </div>

      <div className=" flex items-center justify-center  w-full">
        <div className="p-10 w-full h-full  h-[90%]  ">
          <div className="relative  w-[90%] mx-auto ">
            <div
              className={` w-full  left-0 right-0 top-0 transition-all duration-700 ease-in-out transform ${
                isLogin
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-95 -z-10"
              }`}
            >
              <div className="text-center mb-8 ">
                <h1 className="md:text-4xl  text-xl font-bold text-gray-800">
                  Welcome Back!
                </h1>
                <p className="text-gray-600 md:text-lg text-sm mt-2">
                  Log in to your account to access your dashboard and manage
                  your projects.
                </p>
              </div>
              <form className="space-y-4">
                <div className="relative py-2">
                  <label
                    className="absolute -top-1 left-2 text-[18px] bg-white px-4"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    className="w-full border outline-none py-3 px-4 rounded-[8px] focus:border focus:border-blue-600 text-[18px]"
                  />
                </div>
                <div className="relative py-2">
                  <label
                    className="absolute -top-1 left-2 text-[18px] bg-white px-4"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="flex items-center gap-2 border outline-none px-4 rounded-[8px] focus:border focus:border-blue-600">
                    <input
                      type={eye ? "text" : "password"}
                      className="w-full py-3 outline-none text-[18px]"
                    />
                    <span
                      onClick={() => setEye((prev) => !prev)}
                      className="text-[23px] cursor-pointer"
                    >
                      {eye ? <FaEyeSlash /> : <FaRegEye />}
                    </span>
                  </div>
                </div>

                <div className="text-center py-2">
                  <p className="text-gray-500 text-sm mt-1">
                    Don’t have an account?{" "}
                    <span
                      onClick={() => setIsLogin(false)}
                      className="text-blue-600 font-semibold cursor-pointer"
                    >
                      Sign up here
                    </span>
                  </p>
                </div>

                <button className="rounded-[10px] bg-blue-600 text-white font-semibold text-[20px] w-full py-3 mt-4">
                  Log In
                </button>
              </form>
            </div>

            <div
              className={`absolute w-full left-0 right-0 top-0 transition-all duration-700 ease-in-out transform ${
                isLogin
                  ? "opacity-0 scale-95 -z-10"
                  : "opacity-100 scale-100 z-10"
              }`}
            >
              <div className="text-center mb-8">
                <h1 className="md:text-4xl text-2xl font-bold text-gray-800">
                  Create Account
                </h1>
                <p className="text-gray-600 md:text-lg text-sm mt-2">
                  Sign up to get started and manage your projects easily.
                </p>
              </div>
              <form className="space-y-4">
                <div className="relative py-2">
                  <label
                    className="absolute -top-1 left-2 text-[18px] bg-white px-4"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full border outline-none py-3 px-4 rounded-[8px] focus:border focus:border-blue-600 text-[18px]"
                  />
                </div>
                <div className="relative py-2">
                  <label
                    className="absolute -top-1 left-2 text-[18px] bg-white px-4"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    className="w-full border outline-none py-3 px-4 rounded-[8px] focus:border focus:border-blue-600 text-[18px]"
                  />
                </div>
                <div className="relative py-2">
                  <label
                    className="absolute -top-1 left-2 text-[18px] bg-white px-4"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="flex items-center gap-2 border outline-none px-4 rounded-[8px] focus:border focus:border-blue-600">
                    <input
                      type={eye ? "text" : "password"}
                      className="w-full py-3 outline-none text-[18px]"
                    />
                    <span
                      onClick={() => setEye((prev) => !prev)}
                      className="text-[23px] cursor-pointer"
                    >
                      {eye ? <FaEyeSlash /> : <FaRegEye />}
                    </span>
                  </div>
                </div>
                <div className="relative py-2">
                  <label
                    className="absolute -top-1 left-2 text-[18px] bg-white px-4"
                    htmlFor="confirm-password"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full border outline-none py-3 px-4 rounded-[8px] focus:border focus:border-blue-600 text-[18px]"
                  />
                </div>

                <div className="text-center py-2">
                  <p className="text-gray-500 text-sm mt-1">
                    Already have an account?{" "}
                    <span
                      onClick={() => setIsLogin(true)}
                      className="text-blue-600 font-semibold cursor-pointer"
                    >
                      Log in here
                    </span>
                  </p>
                </div>

                <button className="rounded-[10px] bg-blue-600 text-white font-semibold text-[20px] w-full py-3 mt-4">
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
