import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../axios/axiosinstance";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill both password fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post(`/auth/reset/${token}`, {
        newPassword,
      });
      toast.success(res?.data?.msg || "Password reset successful");
      navigate("/login");
    } catch (error) {
      const msg =
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        "Failed to reset password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div>
          <h1 className="mb-2 text-3xl font-black f3">Reset Password</h1>
        </div>
        <p className="mb-6 text-sm text-white/60 f3"> 
          Enter your new password for this account.
        </p>

        

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
