import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { KeyRound, ShieldCheck } from "lucide-react";
import Layout from "../components/Layout";

const API_URL = "https://teamhub-backend-production-8ab4.up.railway.app/api";

const ROLE_COLORS = ["#7C3AED", "#06B6D4", "#F59E0B", "#10B981", "#EC4899"];

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const res = await axios.get(`${API_URL}/roles`);
      setRoles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8 md:p-12 max-w-5xl mx-auto">
        <p className="text-[#6B7280] text-sm font-mono mb-1">// roles & permissions</p>
        <h1 className="text-3xl font-display font-bold text-[#E8EAFF] mb-8">Roles</h1>

        {loading ? (
          <p className="text-[#6B7280] text-center py-10">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {roles.map((role, i) => {
              const color = ROLE_COLORS[i % ROLE_COLORS.length];
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#0F1326] border border-[#1E2245] rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${color}1A` }}
                    >
                      <KeyRound size={18} style={{ color }} />
                    </div>
                    <h2 className="text-lg font-display font-bold text-[#E8EAFF]">{role.name}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions?.length > 0 ? (
                      role.permissions.map((p) => (
                        <span
                          key={p.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141830] text-[#9CA3AF] text-xs font-mono border border-[#1E2245]"
                        >
                          <ShieldCheck size={11} /> {p.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[#6B7280] text-xs italic">No permissions assigned</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}