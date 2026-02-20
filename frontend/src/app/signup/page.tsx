"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [gender, setGender] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-slate-900">
          Create an account!
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create events in seconds
        </p>

        {/* Google OAuth Button */}
        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
        >
          <GoogleG className="h-5 w-5" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* First + Last name */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* Age + Sex */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-1/2 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />

            <label htmlFor="sex" className="sr-only">Select Sex</label>
            <select
              aria-label="Select Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* CTA */}
          <button
            type="submit"
            className="w-full rounded-xl py-3 text-sm font-semibold text-white
                       bg-gradient-to-r from-sky-500 via-blue-500 to-fuchsia-500
                       shadow-[0_10px_20px_rgba(59,130,246,0.25)]
                       transition hover:from-sky-600 hover:via-blue-600 hover:to-fuchsia-600
                       active:scale-[0.99]"
          >
            Log in
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link className="text-slate-800 hover:underline cursor-pointer" href={"/signin"}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.2 0 6.1 1.1 8.4 3.2l6.2-6.2C34.8 2.8 29.7.8 24 .8 14.7.8 6.7 6.1 2.8 13.8l7.2 5.6C12 13.6 17.5 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12.7c-.6 3-2.4 5.6-5.2 7.3l7.9 6.1c4.6-4.2 6.7-10.4 6.7-17.1z"/>
      <path fill="#FBBC05" d="M10 28.4c-1.1-3-1.1-6.2 0-9.2l-7.2-5.6C-.6 18.5-.6 29.5 2.8 34.4L10 28.4z"/>
      <path fill="#34A853" d="M24 47.2c5.7 0 10.6-1.9 14.1-5.2l-7.9-6.1c-2.2 1.5-5 2.4-6.2 2.4-6.5 0-12-4.1-14-9.9l-7.2 5.9C6.7 42.1 14.7 47.2 24 47.2z"/>
    </svg>
  );
}

