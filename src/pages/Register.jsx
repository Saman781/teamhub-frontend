import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen mesh-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-[#0F1326]/90 backdrop-blur-xl border border-[#1E2245] rounded-2xl p-8 md:p-10 glow-violet"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            className="w-14 h-14 bg-gradient-to-br from-violet to-teal rounded-2xl mx-auto mb-4 flex items-center justify-center glow-violet"
          >
            <Sparkles className="text-white" size={24} />
          </motion.div>
          <h1 className="text-3xl font-display font-bold text-[#E8EAFF] tracking-tight">Create Account</h1>
          <p className="text-[#6B7280] mt-2 text-sm font-mono">// join Team Hub</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#EF4444]/10 text-[#EF4444] text-sm rounded-xl px-4 py-3 mb-4 font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ color: "#E8EAFF" }}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#141830] border border-[#1E2245] placeholder:text-[#6B7280] focus:outline-none focus:border-[#7C3AED] transition-colors"
              placeholder="Full Name"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ color: "#E8EAFF" }}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#141830] border border-[#1E2245] placeholder:text-[#6B7280] focus:outline-none focus:border-[#7C3AED] transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ color: "#E8EAFF" }}
              className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#141830] border border-[#1E2245] placeholder:text-[#6B7280] focus:outline-none focus:border-[#7C3AED] transition-colors"
              placeholder="At least 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#E8EAFF] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "#7C3AED" }}
          >
            {loading ? "Creating account..." : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-sm text-[#6B7280] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#7C3AED] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}