import React from "react";
import { registerPageStyles as s } from "../assets/dummyStyles";
import AuthShell from "../Components/AuthShell";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { register, apiError } from "../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // for onChange
  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((e) => ({ ...e, [field]: "" }));
      setSubmitError("");
    };
  }

  // to submit the data to server and otp;
  async function handleSubmit(e) {
    e.preventDefault();
    const er = {};
    if (form.name.trim().length < 2) er.name = "Enter your name";
    if (!form.email.includes("@")) er.email = "Enter a valid email";
    if (form.password.length < 6)
      er.password = "Password must be at least 6 characters";
    setErrors(er);

    if (Object.keys(er).length > 0) return;
    setLoading(true);
    try {
      const result = await register(form);
      const params = new URLSearchParams({ email: result.email });
      navigate(`/verify-email?${params.toString()}`);
    } catch (e) {
      setSubmitError(apiError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Sign up for a free account to get started."
      footer={
        <>
          <p className={s.footerText}>
            Already have an account?{" "}
            <Link to="/login" className={s.signInLink}>
              Sign in
            </Link>
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className={s.form}>
        <label className="block text-sm font-medium text-white/80 mb-2 ml-3">
          Name
        </label>
        <input
          className="w-full h-12 px-4 rounded-xl
      bg-white/5
      border border-white/10
      text-white
      placeholder:text-white/30
      outline-none
      transition-all duration-200
      focus:border-violet-500
      focus:ring-2 focus:ring-violet-500/20
      hover:border-white/20"
          label="Name"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={update("name")}
          error={errors.name}
          autoComplete="name"
          required
        />

        <label className="block text-sm font-medium text-white/80 mb-2 ml-3">
          Email
        </label>

        <input
          className="w-full h-12 px-4 rounded-xl
      bg-white/5
      border border-white/10
      text-white
      placeholder:text-white/30
      outline-none
      transition-all duration-200
      focus:border-violet-500
      focus:ring-2 focus:ring-violet-500/20
      hover:border-white/20"
          label="Email"
          name="email"
          type="email"
          placeholder="me@example.com"
          value={form.email}
          onChange={update("email")}
          error={errors.email}
          autoComplete="email"
          required
        />

        <div className="relative w-full">
          <label className="block text-sm font-medium text-white/80 mb-2 ml-3">
            Password
          </label>
          <input
            className="w-full h-12 px-4 pr-12 rounded-xl
      bg-white/5
      border border-white/10
      text-white
      placeholder:text-white/30
      outline-none
      transition-all duration-200
      focus:border-violet-500
      focus:ring-2 focus:ring-violet-500/20
      hover:border-white/20"
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={update("password")}
            error={errors.password}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-13 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {submitError && <p className={s.submitError}>{submitError}</p>}

        <button type="submit" className={`${s.submitButton} mt-5`} disabled={loading}>
          {loading ? "Sending Code..." : "Send verification code"}
        </button>

        <div className={s.infoBox}>
          <div className={s.infoRow}>
            <span className={s.infoDotIndigo}></span>
            We'll email you a 6-digit code. Enter it to verify, then sign in.
          </div>

          <div className={s.infoRow}>
            <span className={s.infoDotEmerald}></span>
            You get <span className={s.infoHighlight}>20 free credits</span> on
            first login.
          </div>
        </div>
      </form>
    </AuthShell>
  );
};

export default Register;
