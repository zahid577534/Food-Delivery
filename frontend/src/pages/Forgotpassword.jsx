import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Input from "../Input";
import { serverUrl } from "../config";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const borderColor = "#ff4d2d";

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setServerError("");
    setLoading(true);

    try {
      await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );

      setStep(2);
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
        "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    const newErrors = {};

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setServerError("");
    setLoading(true);

    try {
      await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      setStep(3);
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
        "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };
  // Step 3: Reset Password
  const handleResetPassword = async () => {
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword =
        "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setServerError("");
    setLoading(true);

    try {
      await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        {
          email,
          newPassword,
        },
        { withCredentials: true }
      );

      navigate("/signin");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
        "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate("/signin");
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleButtonClick = () => {
    if (step === 1) {
      handleSendOtp();
    } else if (step === 2) {
      handleVerifyOtp();
    } else {
      handleResetPassword();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fff9f6] p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={handleBack}>
            <IoIosArrowBack className="text-[#ff4d2d]" size={22} />
          </button>

          <h1 className="text-lg font-bold text-[#ff4d2d]">
            Forgot Password
          </h1>
        </div>

        {/* Step 1 */}
        {step === 1 && (
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
              setErrors((prev) => ({
                ...prev,
                email: "",
              }));
            }}
          />
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Input
            label="OTP"
            name="otp"
            type="text"
            placeholder="Enter OTP"
            borderColor={borderColor}
            value={otp}
            error={errors.otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setErrors((prev) => ({
                ...prev,
                otp: "",
              }));
            }}
          />
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              borderColor={borderColor}
              value={newPassword}
              error={errors.newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  newPassword: "",
                }));
              }}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              borderColor={borderColor}
              value={confirmPassword}
              error={errors.confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: "",
                }));
              }}
            />
          </>
        )}

        {/* Button */}
        {serverError && (
          <div className="mb-4 text-sm text-center text-red-600">
            {serverError}
          </div>
        )}
        <button
          onClick={handleButtonClick}
          disabled={loading}
          className="w-full mt-6 bg-[#ff4d2d] text-white py-2 rounded-md hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition"
        >
          {loading
            ? "Processing..."
            : step === 1
              ? "Send OTP"
              : step === 2
                ? "Verify OTP"
                : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;