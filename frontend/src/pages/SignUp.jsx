import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import React, { useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { IoIosEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import Input from "../Input";

const SignUp = () => {
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const dispatch = useDispatch();
  const roles = ["user", "owner", "deliveryboy"];

  // validation function
  const validateForm = () => {
    const newErrors = {};

    if (!fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^03\d{9}$/.test(mobile)) {
      newErrors.mobile = "Please enter a valid mobile number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  // Normal Signup
  const handleSignUp = async (e) => {
  e.preventDefault();
  setServerError("");

  if (!validateForm()) return;

  setLoading(true);

  try {
    const userData = {
      fullName: fullname,
      email,
      mobile,
      password,
      role,
    };

    const result = await axios.post(
    `${serverUrl}/api/auth/signup`,
    userData,
    { withCredentials: true }
    );

    // ❌ REMOVE THIS (not needed with cookie auth)
    // localStorage.setItem("token", result.data.token);

    dispatch(setUser(result.data.user));

    // usually go to signin OR directly dashboard
    navigate("/signin");

  } catch (error) {
    setServerError(
      error.response?.data?.message ||
      error.message ||
      "Signup Failed"
    );
  } finally {
    setLoading(false);
  }
};

  // Google Signup
 const handleGoogleSignUp = async () => {
  setServerError("");

  const newErrors = {};

  if (!mobile.trim()) {
    newErrors.mobile = "Mobile number is required";
  } else if (!/^03\d{9}$/.test(mobile)) {
    newErrors.mobile = "Please enter a valid mobile number";
  }

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  setGoogleLoading(true);

  try {
    const provider = new GoogleAuthProvider();
    const firebaseResult = await signInWithPopup(auth, provider);
    const firebaseUser = firebaseResult.user;

    const backendResult = await axios.post(
      `${serverUrl}/api/auth/google-signup`,
      {
        fullName: firebaseUser.displayName,
        email: firebaseUser.email,
        mobile,
        role: "user",
      },
      { withCredentials: true }
    );

    // ❌ REMOVE localStorage
    dispatch(setUser(backendResult.data.user));

    navigate("/");

  } catch (error) {
    setServerError(
      error.response?.data?.message ||
      error.message ||
      "Google Sign-Up Failed"
    );
  } finally {
    setGoogleLoading(false);
  }
};

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ background: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1
          className="text-3xl font-bold mb-2 text-center"
          style={{ color: primaryColor }}
        >
          Kozina
        </h1>

        <p className="text-gray-600 mb-6 text-center">
          Create Your Account
        </p>

        <form onSubmit={handleSignUp}>
          <Input
            label="Full Name"
            name="fullname"
            placeholder="Enter your full name"
            borderColor={borderColor}
            value={fullname}
            error={errors.fullname}
            onChange={(e) => {
              setFullname(e.target.value);
              setErrors((prev) => ({ ...prev, fullname: "" }));
            }}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            borderColor={borderColor}
            value={email}
            error={errors.email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
          />
          <Input
            label="Mobile Number"
            name="mobile"
            placeholder="Enter your mobile number"
            borderColor={borderColor}
            value={mobile}
            error={errors.mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              setErrors((prev) => ({ ...prev, mobile: "" }));
            }}
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>

            <div className="flex gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setErrors((prev) => ({
                      ...prev,
                      role: "",
                    }));
                  }}
                  className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition capitalize"
                  style={
                    role === r
                      ? {
                        background: primaryColor,
                        color: "#fff",
                        borderColor: primaryColor,
                      }
                      : {
                        background: "transparent",
                        color: "#333",
                        borderColor,
                      }
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
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
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 text-gray-500"
              >
                {showPassword ? (
                  <IoIosEyeOff size={20} />
                ) : (
                  <IoEyeSharp size={20} />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}


            </div>
          </div>
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="flex items-center my-5">
            <div className="flex-1 h-[1px] bg-gray-300"></div>

            <span className="px-3 text-sm text-gray-500">OR</span>

            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full font-semibold py-3 rounded-lg bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2 border border-gray-300 disabled:opacity-70"
          >
            <FcGoogle size={22} />
            <span>
              {googleLoading
                ? "Signing Up..."
                : "Sign Up with Google"}
            </span>
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="cursor-pointer font-medium"
            style={{ color: primaryColor }}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;