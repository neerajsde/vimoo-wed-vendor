import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdReportGmailerrorred } from "react-icons/md";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import MdLoader from "../components/spinner/MdLoader";

const ForgotPassword = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [serverOtp, setServerOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.document.title = "Forgot Password";
  }, []);

  const sendOtpHandler = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setIsLoading(true);
      const url = `${baseUrl}/vendor/forgot-password/send-otp`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setServerOtp(data.otp);
        setIsOtpSent(true);
        toast.success("OTP sent to your email.");
      } else {
        setError(data.message || "Failed to send OTP. Try again.");
      }
    } catch (err) {
      console.error("Error:", err.message);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordHandler = async () => {
    if (otpCode !== serverOtp) {
      setError("Wrong OTP.");
      toast.error("Please re-enter correct OTP");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const url = `${baseUrl}/vendor/forgot-password/reset-password`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Password reset successful.");
        navigate("/");
      } else {
        setError(data.message || "Failed to reset password. Try again.");
      }
    } catch (err) {
      console.error("Error:", err.message);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center py-4">
      <div className="w-[500px] flex flex-col text-white bg-[#111] py-6 px-8 max-sm:p-4 rounded-xl gap-6 max-sm:gap-4 max-md:w-[400px] max-sm:w-full">
        <div className="w-full flex flex-col gap-1">
          <h1 className="text-xl font-bold text-white max-md:text-lg">
            Forgot Password
          </h1>
          <p className="text-md font-semibold text-gray-400 max-md:text-sm">
            {isOtpSent
              ? "Enter the OTP sent to your email and reset your password"
              : "Enter your email to receive a password reset OTP"}
          </p>
        </div>

        <div className="w-full flex flex-col gap-6 max-md:gap-3">
          {!isOtpSent && (
            <label className="w-full flex flex-col gap-2">
              <p className="text-base font-semibold text-gray-500 max-md:text-sm">
                Email Address
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setError("");
                  setEmail(e.target.value);
                }}
                placeholder="example@gmail.com"
                className="text-lg max-md:text-base font-semibold py-2 px-3 bg-[#333] text-white placeholder:text-gray-500 rounded outline-none border-2 border-transparent transition duration-300 ease-in hover:border-blue-300 focus:border-blue-600"
              />
            </label>
          )}

          {isOtpSent && (
            <>
              <label className="w-full flex flex-col gap-2">
                <p className="text-base font-semibold text-gray-500 max-md:text-sm">
                  OTP
                </p>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => {
                    setError("");
                    setOtpCode(e.target.value);
                  }}
                  placeholder="Enter OTP"
                  className="text-lg max-md:text-base font-semibold py-2 px-3 bg-[#333] text-white placeholder:text-gray-500 rounded outline-none border-2 border-transparent transition duration-300 ease-in hover:border-blue-300 focus:border-blue-600"
                />
              </label>

              <label className="w-full flex flex-col relative gap-2">
                <p className="text-base font-semibold text-gray-500 max-md:text-sm">
                  New Password
                </p>
                <input
                  type={isVisiblePass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setError("");
                    setNewPassword(e.target.value);
                  }}
                  placeholder="Enter new password"
                  className="text-lg max-md:text-base font-semibold py-2 px-3 bg-[#333] text-white placeholder:text-gray-500 rounded outline-none border-2 border-transparent transition duration-300 ease-in hover:border-blue-300 focus:border-blue-600"
                />
                <div
                  className="absolute top-10 right-2 text-3xl max-md:text-xl cursor-pointer text-gray-500"
                  onClick={() => setIsVisiblePass(!isVisiblePass)}
                >
                  {isVisiblePass ? <IoMdEyeOff /> : <IoMdEye />}
                </div>
              </label>

              <label className="w-full flex flex-col gap-2">
                <p className="text-base font-semibold text-gray-500 max-md:text-sm">
                  Confirm Password
                </p>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setError("");
                    setConfirmPassword(e.target.value);
                  }}
                  placeholder="Confirm password"
                  className="text-lg max-md:text-base font-semibold py-2 px-3 bg-[#333] text-white placeholder:text-gray-500 rounded outline-none border-2 border-transparent transition duration-300 ease-in hover:border-blue-300 focus:border-blue-600"
                />
              </label>
            </>
          )}

          {error && (
            <div className="w-full flex items-center justify-start gap-2 py-1 px-3 text-md max-md:text-sm max-sm:text-xs text-red-500 border border-red-500 font-semibold">
              <MdReportGmailerrorred className="text-xl max-md:text-lg text-orange-500" />
              {error}
            </div>
          )}

          <div className="w-full flex justify-start items-center gap-4">
            {!isOtpSent && (
              <button
                className="text-lg w-[150px] h-[40px] max-md:text-base flex items-center justify-center gap-4 font-extrabold text-white border-2 border-blue-600 bg-blue-600 py-1 px-4 rounded-3xl transition duration-300 ease-in hover:bg-transparent"
                onClick={sendOtpHandler}
              >
                {isLoading ? <MdLoader /> : "Send OTP"}
              </button>
            )}

            {isOtpSent && (
              <button
                className="text-lg w-[200px] h-[40px] max-md:text-base flex items-center justify-center gap-4 font-extrabold text-white border-2 border-blue-600 bg-blue-600 py-1 px-4 rounded-3xl transition duration-300 ease-in hover:bg-transparent"
                onClick={resetPasswordHandler}
              >
                {isLoading ? <MdLoader /> : "Reset Password"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
