"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, RefreshCw } from "lucide-react";
import api, { getErrorMessage } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Suspense } from "react";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown((p) => p - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  const handleChange = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[i] = value.slice(-1);
    setOtp(newOtp);
    if (value && i < 5) inputRefs.current[i + 1]?.focus();
    if (newOtp.every((d) => d) && newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split("");
      setOtp(digits);
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/verify-email-otp", {
        email: emailParam,
        otp: code,
      });
      if (res.data.data?.token) {
        localStorage.setItem("sm_token", res.data.data.token);
      }
      await refreshUser();
      setSuccess(true);
      setTimeout(() => router.push("/"), 1800);
    } catch (err) {
      setError(getErrorMessage(err));
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setResending(true);
    setError("");
    try {
      await api.post("/auth/resend-otp", { email: emailParam });
      setResendCooldown(60);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary-500 mb-3">
            Email Verified!
          </h1>
          <p className="text-gray-500">
            Welcome to Saddles Market. Redirecting you now...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-luxury p-8 md:p-10 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📧</span>
        </div>
        <h1 className="font-serif text-2xl font-bold text-primary-500 mb-2">
          Check Your Email
        </h1>
        <p className="text-gray-500 text-sm mb-2">We sent a 6-digit code to:</p>
        <p className="font-semibold text-gray-900 mb-8">{emailParam}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={loading}
              className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all
                ${digit ? "border-primary-400 bg-primary-50 text-primary-600" : "border-gray-200 bg-white text-gray-900"}
                focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:opacity-60`}
            />
          ))}
        </div>

        <button
          onClick={() => handleVerify(otp.join(""))}
          disabled={otp.join("").length !== 6 || loading}
          className="btn-primary w-full py-4 text-base mb-4 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <button
          onClick={resendOTP}
          disabled={resending || resendCooldown > 0}
          className="flex items-center justify-center gap-2 w-full text-sm text-gray-500 hover:text-primary-600 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
          {resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : "Didn't receive it? Resend code"}
        </button>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
