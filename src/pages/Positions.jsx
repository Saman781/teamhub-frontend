import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import Layout from "../components/Layout";

const API_URL = "https://teamhub-backend-production-8ab4.up.railway.app/api";

const ROLE_COLORS = {
  Admin: "#7C3AED",
  HR: "#06B6D4",
  Employee: "#10B981",
};

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      const res = await axios.get(`${API_URL}/positions`);
      setPositions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8 md:p-12 max-w-5xl mx-auto">
        <p className="text-[#6B7280] text-sm font-mono mb-1">// job titles</p>
        <h1 className="text-3xl font-display font-bold text-[#E8EAFF] mb-8">Positions</h1>

        <div className="bg-[#0F1326] border border-[#1E2245] rounded-2xl overflow-hidden">
          {loading ? (
            <p className="p-8 text-[#6B7280] text-center">Loading...</p>
          ) : positions.length === 0 ? (
            <p className="p-8 text-[#6B7280] text-center">No positions yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1E2245] text-[#6B7280] text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Position Title</th>
                  <th className="p-4 font-semibold">Mapped Role</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos, i) => {
                  const color = ROLE_COLORS[pos.role?.name] || "#6B7280";
                  return (
                    <motion.tr
                      key={pos.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-[#1E2245] last:border-0 hover:bg-[#141830]/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: `${color}1A` }}
                          >
                            <Tag size={14} style={{ color }} />
                          </div>
                          <span className="font-semibold text-[#E8EAFF] text-sm">{pos.title}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: `${color}1A`, color }}
                        >
                          {pos.role?.name}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}