import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import React, { useState } from 'react'
import { IoEyeSharp } from "react-icons/io5"
import { IoIosEyeOff } from "react-icons/io"
import { FcGoogle } from "react-icons/fc"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
//import Forgotpassword from "./Forgotpassword";
//import { Route } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import Input from "../Input";
const SignIn = () => {
  const primaryColor = '#ff4d2d'
  const bgColor = '#fff9f6'
  const borderColor = '#ddd'

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  // validation function
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  // Login Function
const handleSignIn = async (e) => {
  e.preventDefault();

  setServerError("");

  if (!validateForm()) return;

  setLoading(true);

  try {
    const result = await axios.post(
      `${serverUrl}/api/auth/signin`,
      { email, password },
      { withCredentials: true }
    );

    console.log("LOGIN RESPONSE:", result.data);
console.log("LOGIN USER:", result.data.user);
console.log("LOGIN ROLE:", result.data.user?.role);

    // Save token
    localStorage.setItem("token", result.data.token);

    // Save user
    localStorage.setItem(
      "user",
      JSON.stringify(result.data.user)
    );

    // Put user into Redux
    dispatch(setUser(result.data.user));

    // Go to Home
    navigate("/");

  } catch (error) {
    setServerError(
      error.response?.data?.message ||
      error.message ||
      "Login Failed"
    );
  } finally {
    setLoading(false);
  }
};
  // google sign in
  const handleGoogleSignIn = async () => {
    setServerError("");

    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const response = await axios.post(
        `${serverUrl}/api/auth/google-signin`,
        {
          email: user.email,
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
      dispatch(setUser(response.data.user));
      navigate("/");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
        error.message ||
        "Google Sign In Failed"
      );
    } finally {
      setGoogleLoading(false);
    }
   
  };
  return (
    <div
      className='min-h-screen w-full flex items-center justify-center p-4'
      style={{ background: bgColor }}
    >
      <div
        className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'
        style={{ border: `1px solid ${borderColor}` }}
      >
        {/* Logo */}
        <h1
          className='text-3xl font-bold mb-2 text-center'
          style={{ color: primaryColor }}
        >
          Kozina
        </h1>

        <p className='text-gray-600 mb-6 text-center'>
          Welcome Back
        </p>

        {/* Form */}
        <form onSubmit={handleSignIn}>

          {/* Email */}
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            borderColor={borderColor}
            value={email}
            error={errors.email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({
                ...prev,
                email: "",
              }));
            }}
          />

          {/* Password */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>

            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-md focus:outline-none pr-10"
                style={{
                  border: `1px solid ${errors.password ? "red" : borderColor
                    }`,
                }}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));
                }}
              />

              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700'
              >
                {showPassword
                  ? <IoIosEyeOff size={20} />
                  : <IoEyeSharp size={20} />
                }
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className='flex justify-end mb-5'>
            <span
              onClick={() => navigate('/forgot-password')}
              className='text-sm cursor-pointer hover:underline'
              style={{ color: primaryColor }}
            >
              Forgot Password?
            </span>
          </div>

          {/* Login Button */}
          {serverError && (
            <div className="mb-4 text-sm text-center text-red-600">
              {serverError}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md text-white font-semibold disabled:opacity-70"
            style={{ background: primaryColor }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className='flex items-center my-5'>
            <div className='flex-1 h-[1px] bg-gray-300'></div>

            <span className='px-3 text-sm text-gray-500'>
              OR
            </span>

            <div className='flex-1 h-[1px] bg-gray-300'></div>
          </div>

          {/* Google SignIn */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full font-semibold py-3 rounded-lg bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2 border border-gray-300 disabled:opacity-70"
          >
            <FcGoogle size={22} />
            <span>
              {googleLoading
                ? "Signing In..."
                : "Sign In with Google"}
            </span>
          </button>
        </form>

        {/* Footer */}
        <p className='text-sm text-center text-gray-600 mt-6'>
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className='cursor-pointer font-medium'
            style={{ color: primaryColor }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  )
}


export default SignIn