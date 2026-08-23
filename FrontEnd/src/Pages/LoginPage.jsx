import React, { useState } from "react";

import { loginPageStyles as s } from "../assets/dummyStyles";
import AuthShell from "../Components/AuthShell";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { CheckCircle2 } from "lucide-react";

import { login, apiError } from "../utils/api";





const Login = () => {
  const navigate = useNavigate();

  const { loginUser } = useAuth();

  // URL ke query parameters read karne ke liye
  const [params] = useSearchParams();

  const initialEmail = params.get("email") || "";

  const justVerified = params.get("verified") === "1";

  const [form, setForm] = useState({
    email: initialEmail,
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const [submitError, setSubmitError] = useState("");

  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Input change handler
  // -----------------------------

  function update(field) {
    return (e) => {
      setForm((f) => ({
        ...f,
        [field]: e.target.value,
      }));

      setError((e) => ({
        ...e,
        [field]: "",
      }));

      setSubmitError("");
    };
  }

  // -----------------------------
  // Login
  // -----------------------------

  async function handleSubmit(e) {
  e.preventDefault();

  const er = {};

  if (!form.email.includes("@")) {
    er.email = "Enter a valid email";
  }

  if (form.password.length < 6) {
    er.password = "Password must be at least 6 characters";
  }

  setError(er);

  if (Object.keys(er).length > 0) {
    return;
  }

  setLoading(true);
  setSubmitError("");

  try {
    // 1️⃣ Backend login API call
    const result = await login(form);


    // 2️⃣ Backend se token + user
    const { token, user } = result;


    // 3️⃣ Context + localStorage update
    loginUser(token, user);

    // 4️⃣ Dashboard
    navigate("/dashboard");

  } catch (e) {
    console.error(
      "❌ Login error:",
      e.response?.data || e.message
    );

    const status = e?.response?.status;
    const data = e?.response?.data;

    // Email verification required
    if (
      status === 403 &&
      data?.needVerification &&
      data?.email
    ) {
      navigate(
        `/verify-email?email=${encodeURIComponent(
          data.email
        )}`
      );

      return;
    }

    setSubmitError(apiError(e));

  } finally {
    setLoading(false);
  }
}

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <AuthShell
      title="Sign In"
      subtitle="Enter your email and password to sign in."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className={s.signUpLink}>
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className={s.form}>
        {/* Verified message */}
        {justVerified && (
          <div className={s.verifiedBanner}>
            <CheckCircle2 className={s.verifiedIcon} />

            <span>Email verified - sign in to get your free credits!</span>
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-2">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="me@example.com"
            value={form.email}
            onChange={update("email")}
            autoComplete="email"
            required
            className={`
      w-full
      h-12
      px-4
      rounded-xl
      bg-white/[0.04]
      border
      border-white/10
      text-white
      placeholder:text-gray-500
      outline-none
      transition-all
      duration-200
      focus:border-indigo-500
      focus:ring-2
      focus:ring-indigo-500/20
      hover:border-white/20
      ${error.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
    `}
          />

          {error.email && (
            <p className="text-red-400 text-sm mt-1">{error.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className={s.passwordRow}>
            <label htmlFor="password" className={s.passwordLabel}>
              Password
            </label>

            <Link className={s.forgotLink} to="/forgot">
              Forgot password?
            </Link>
          </div>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={update("password")}
            autoComplete="current-password"
            required
            className={s.input}
            className={`
      w-full
      h-12
      px-4
      rounded-xl
      bg-white/[0.04]
      border
      border-white/10
      text-white
      placeholder:text-gray-500
      outline-none
      transition-all
      duration-200
      focus:border-indigo-500
      focus:ring-2
      focus:ring-indigo-500/20
      hover:border-white/20
      ${error.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
    `}
          />

          {error.password && (
            <p className="text-red-400 text-sm mt-1">{error.password}</p>
          )}
        </div>

        {/* Submit error */}
        {submitError && <p className={s.submitError}>{submitError}</p>}

        {/* Login button */}
        <button
          type="submit"
          className={`${s.submitButton} mt-5`}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </AuthShell>
  );
};

export default Login;
