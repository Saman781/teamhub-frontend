import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, KeyRound, Tag, LogOut, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "#7C3AED" },
  { to: "/users", label: "Users", icon: Users, color: "#06B6D4" },
  { to: "/roles", label: "Roles", icon: KeyRound, color: "#F59E0B" },
  { to: "/permissions", label: "Permissions", icon: ShieldCheck, color: "#10B981" },
  { to: "/positions", label: "Positions", icon: Tag, color: "#EC4899" },
];

export default function Layout({ children }) {
  const { user, roles, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen mesh-bg flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-[#1E2245] bg-[#0F1326]/80 backdrop-blur-xl flex flex-col p-5">
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet to-teal flex items-center justify-center glow-violet">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">Team Hub</span>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors group"
                style={{
                  background: active ? `${item.color}1A` : "transparent",
                  color: active ? item.color : "#9CA3AF",
                }}
              >
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `${item.color}1A`, border: `1px solid ${item.color}40` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon size={18} className="relative z-10" />
                <span className="relative z-10 font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#1E2245] pt-4 mt-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-pink flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#E8EAFF] truncate">{user?.name}</p>
              <p className="text-xs text-[#6B7280] truncate">{roles?.[0] || "Member"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#9CA3AF] hover:bg-[#1A1F3A] hover:text-[#E8EAFF] transition-colors"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}