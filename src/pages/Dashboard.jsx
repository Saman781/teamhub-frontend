import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, KeyRound, Tag, ArrowUpRight, ShieldCheck, TrendingUp } from "lucide-react";
import Layout from "../components/Layout";

const API_URL = "https://teamhub-backend-production-8ab4.up.railway.app/api";

export default function Dashboard() {
  const { user, roles } = useAuth();
  const [stats, setStats] = useState({ users: 0, roles: 0, positions: 0, permissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersRes, rolesRes, positionsRes, permsRes] = await Promise.all([
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/roles`),
        axios.get(`${API_URL}/positions`),
        axios.get(`${API_URL}/permissions`),
      ]);
      setStats({
        users: usersRes.data.length,
        roles: rolesRes.data.length,
        positions: positionsRes.data.length,
        permissions: permsRes.data.length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "#06B6D4" },
    { label: "Roles", value: stats.roles, icon: KeyRound, color: "#F59E0B" },
    { label: "Positions", value: stats.positions, icon: Tag, color: "#EC4899" },
    { label: "Permissions", value: stats.permissions, icon: ShieldCheck, color: "#10B981" },
  ];

  const cards = [
    {
      title: "Team Members",
      desc: "Add, manage & assign roles to your team",
      icon: Users,
      to: "/users",
      color: "#06B6D4",
    },
    {
      title: "Roles & Permissions",
      desc: "Define what each role can access",
      icon: KeyRound,
      to: "/roles",
      color: "#F59E0B",
    },
    {
      title: "Positions",
      desc: "Map job titles to system roles",
      icon: Tag,
      to: "/positions",
      color: "#EC4899",
    },
  ];

  return (
    <Layout>
      <div className="p-8 md:p-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-[#6B7280] text-sm font-mono mb-1">// dashboard</p>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[#E8EAFF] tracking-tight">
            Hey, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-[#9CA3AF] mt-2">
            You're signed in as{" "}
            <span className="font-semibold" style={{ color: "#7C3AED" }}>
              {roles?.[0] || "Member"}
            </span>
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-[#0F1326] border border-[#1E2245] rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}1A` }}
                >
                  <stat.icon size={16} style={{ color: stat.color }} />
                </div>
                <TrendingUp size={14} className="text-[#10B981]" />
              </div>
              <p className="text-2xl font-display font-bold text-[#E8EAFF]">
                {loading ? "—" : stat.value}
              </p>
              <p className="text-[#6B7280] text-xs mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Access Cards */}
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider mb-3">Quick Access</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link
                to={card.to}
                className="group block bg-[#0F1326] border border-[#1E2245] rounded-2xl p-6 hover:border-opacity-60 transition-all h-full"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${card.color}60`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E2245")}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${card.color}1A` }}
                >
                  <card.icon size={22} style={{ color: card.color }} />
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-display font-bold text-[#E8EAFF]">{card.title}</h2>
                  <ArrowUpRight
                    size={18}
                    className="text-[#6B7280] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </div>
                <p className="text-[#9CA3AF] text-sm mt-1.5 leading-relaxed">{card.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}