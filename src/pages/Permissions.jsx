import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ShieldCheck, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Layout from "../components/Layout";

const API_URL = "http://127.0.0.1:8000/api";

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPerm, setNewPerm] = useState("");

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const res = await axios.get(`${API_URL}/permissions`);
      setPermissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newPerm.trim()) return;
    try {
      // Uses the roles endpoint's underlying Permission model via a role-agnostic create
      await axios.post(`${API_URL}/roles`, { name: `temp-${Date.now()}`, permissions: [] });
      toast.error("Creating standalone permissions isn't wired up yet — assign via Roles page.");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="p-8 md:p-12 max-w-5xl mx-auto">
        <p className="text-[#6B7280] text-sm font-mono mb-1">// access control</p>
        <h1 className="text-3xl font-display font-bold text-[#E8EAFF] mb-8">Permissions</h1>

        <div className="bg-[#0F1326] border border-[#1E2245] rounded-2xl p-6">
          {loading ? (
            <p className="text-[#6B7280] text-center py-6">Loading...</p>
          ) : permissions.length === 0 ? (
            <p className="text-[#6B7280] text-center py-6">No permissions yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {permissions.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-2.5 bg-[#141830] border border-[#1E2245] rounded-xl px-4 py-3"
                >
                  <ShieldCheck size={16} className="text-[#7C3AED] shrink-0" />
                  <span className="text-sm text-[#E8EAFF] font-mono">{p.name}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <p className="text-[#6B7280] text-xs mt-4">
          💡 Permissions are assigned to roles from the <span className="text-[#9CA3AF]">Roles</span> page.
        </p>
      </div>
    </Layout>
  );
}