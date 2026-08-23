import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Mail, CheckCircle2 } from "lucide-react";

import { verifyEmailPageStyles as s } from "../assets/dummyStyles";
import { apiError, registerVerify, registerResend } from "../utils/api";
import AuthShell from "../Components/AuthShell";
import { Input } from "../assets/ui";

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const [params] = useSearchParams();

  const email = (params.get("email") || "").toLowerCase();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  const [cooldown, setCooldown] = useState(
    RESEND_COOLDOWN_SECONDS
  );

  const otpRef = useRef(null);

  // Focus OTP input
  useEffect(() => {
    otpRef.current?.focus();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Email nahi hai to register page par bhejo
  useEffect(() => {
    if (!email) {
      navigate("/register", {
        replace: true,
      });
    }
  }, [email, navigate]);

  // Verify OTP
  async function handleVerify(e) {
    e.preventDefault();

    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code");
      return;
    }

    setLoading(true);

    try {
      await registerVerify(email, otp);

      setVerified(true);

      setTimeout(() => {
        navigate(
          `/login?email=${encodeURIComponent(
            email
          )}&verified=1`,
          {
            replace: true,
          }
        );
      }, 1400);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP
  async function handleResend() {
    if (cooldown > 0) return;

    setError("");
    setResending(true);

    try {
      await registerResend(email);

      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setResending(false);
    }
  }

  // Verification successful
  if (verified) {
    return (
      <AuthShell
        title="Verified"
        subtitle=""
      >
        <div className={s.verifiedContainer}>
          <div className={s.verifiedIconWrapper}>
            <CheckCircle2
              className={s.verifiedIcon}
            />
          </div>

          <p className={s.verifiedTitle}>
            Email verified
          </p>

          <p className={s.verifiedSub}>
            Taking you to the sign-in page...
          </p>
        </div>
      </AuthShell>
    );
  }

  // Main verification page
  return (
    <AuthShell
      title="Verify your email"
      subtitle={
        <>
          We sent a 6-digit code to{" "}
          <span className="text-white font-medium">
            {email}
          </span>
          . Enter it below to verify.
        </>
      }
      footer={
        <>
          Wrong email?{" "}
          <Link
            to="/register"
            className={s.signInLink}
          >
            Register again
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleVerify}
        className={s.form}
      >
        <Input
          ref={otpRef}
          label="Verification code"
          name="otp"
          type="text"
          placeholder="6-digit code"
          value={otp}
          onChange={(e) => {
            const value = e.target.value
              .replace(/\D/g, "")
              .slice(0, 6);

            setOtp(value);
            setError("");
          }}
          error={error}
          autoComplete="one-time-code"
          inputMode="numeric"
          required
          className={s.input}
        />

        <button
          type="submit"
          className={`${s.submitButton} mt-5`}
          disabled={
            loading || otp.length !== 6
          }
        >
          {loading
            ? "Verifying..."
            : "Verify email"}
        </button>

        <div className={s.resendRow}>
          <span className={s.resendLeft}>
            <Mail className={s.resendIcon} />

            Didn't receive a code?
          </span>

          <button
            type="button"
            onClick={handleResend}
            className={`${s.resendButton} ml-2`}
            disabled={
              resending || cooldown > 0
            }
          >
            {resending
              ? "Resending..."
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend code"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
};

export default VerifyEmailPage;