import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Trash2, X, Mail, Search, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import Layout from "../components/Layout";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const ROLE_COLORS = {
  Admin: "#7C3AED",
  HR: "#06B6D4",
  Employee: "#10B981",
};

function avatarColor(name) {
  const colors = ["#7C3AED", "#06B6D4", "#F59E0B", "#10B981", "#EC4899", "#EF4444"];
  const i = (name?.charCodeAt(0) || 0) % colors.length;
  return colors[i];
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/roles`),
      ]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API_URL}/users`, form);
      setForm({ name: "", email: "", password: "", role: "" });
      setShowForm(false);
      loadData();
      toast.success(`${form.name} added successfully!`);
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleAssignRole = async (userId, roleName) => {
    if (!roleName) return;
    try {
      await axios.post(`${API_URL}/users/${userId}/assign-role`, { role: roleName });
      loadData();
      toast.success(`Role updated to ${roleName}`);
    } catch (err) {
      toast.error("Could not assign role");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API_URL}/users/${deleteTarget.id}`);
      loadData();
      toast.success(`${deleteTarget.name} deleted`);
    } catch (err) {
      toast.error("Could not delete user");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-8 md:p-12 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[#6B7280] text-sm font-mono mb-1">// team members</p>
            <h1 className="text-3xl font-display font-bold text-[#E8EAFF]">Users</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: "#7C3AED" }}
          >
            {showForm ? <X size={16} /> : <UserPlus size={16} />}
            {showForm ? "Cancel" : "Add User"}
          </motion.button>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ color: "#E8EAFF" }}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0F1326] border border-[#1E2245] placeholder:text-[#6B7280] focus:outline-none focus:border-[#7C3AED] transition-colors text-sm"
          />
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreate}
              className="overflow-hidden"
            >
              <div className="bg-[#0F1326] border border-[#1E2245] rounded-2xl p-6 mb-6 space-y-4">
                {error && (
                  <div className="bg-[#EF4444]/10 text-[#EF4444] text-sm rounded-xl px-4 py-3 font-medium">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text" placeholder="Full Name" required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ color: "#E8EAFF" }}
                    className="px-4 py-3 rounded-xl bg-[#141830] border border-[#1E2245] placeholder:text-[#6B7280] focus:outline-none focus:border-[#7C3AED] transition-colors"
                  />
                  <input
                    type="email" placeholder="Email" required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ color: "#E8EAFF" }}
                    className="px-4 py-3 rounded-xl bg-[#141830] border border-[#1E2245] placeholder:text-[#6B7280] focus:outline-none focus:border-[#7C3AED] transition-colors"
                  />
                  <input
                    type="password" placeholder="Password" required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ color: "#E8EAFF" }}
                    className="px-4 py-3 rounded-xl bg-[#141830] border border-[#1E2245] placeholder:text-[#6B7280] focus:outline-none focus:border-[#7C3AED] transition-colors"
                  />
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    style={{ color: "#E8EAFF" }}
                    className="px-4 py-3 rounded-xl bg-[#141830] border border-[#1E2245] focus:outline-none focus:border-[#7C3AED] transition-colors"
                  >
                    <option value="">No role (assign later)</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 rounded-xl font-semibold text-sm text-white"
                  style={{ background: "#10B981" }}
                >
                  Create User
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="bg-[#0F1326] border border-[#1E2245] rounded-2xl overflow-hidden">
          {loading ? (
            <p className="p-8 text-[#6B7280] text-center">Loading...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="p-8 text-[#6B7280] text-center">
              {search ? "No users match your search." : "No users yet. Add your first one!"}
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1E2245] text-[#6B7280] text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Assign Role</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-[#1E2245] last:border-0 hover:bg-[#141830]/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: avatarColor(u.name) }}
                        >
                          {u.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[#E8EAFF] text-sm">{u.name}</p>
                          <p className="text-[#6B7280] text-xs flex items-center gap-1">
                            <Mail size={11} /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {u.roles?.length > 0 ? (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: `${ROLE_COLORS[u.roles[0].name] || "#6B7280"}1A`,
                            color: ROLE_COLORS[u.roles[0].name] || "#9CA3AF",
                          }}
                        >
                          {u.roles[0].name}
                        </span>
                      ) : (
                        <span className="text-[#6B7280] text-xs italic">No role</span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        onChange={(e) => handleAssignRole(u.id, e.target.value)}
                        defaultValue=""
                        style={{ color: "#E8EAFF" }}
                        className="px-3 py-2 rounded-lg bg-[#141830] border border-[#1E2245] text-sm focus:outline-none focus:border-[#7C3AED]"
                      >
                        <option value="" disabled>Select role</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="text-[#EF4444] hover:bg-[#EF4444]/10 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0F1326] border border-[#1E2245] rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 flex items-center justify-center mb-4">
                <AlertTriangle className="text-[#EF4444]" size={22} />
              </div>
              <h3 className="text-lg font-display font-bold text-[#E8EAFF] mb-1.5">Delete user?</h3>
              <p className="text-[#9CA3AF] text-sm mb-6">
                Are you sure you want to delete <span className="text-[#E8EAFF] font-medium">{deleteTarget.name}</span>? This can't be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl font-medium text-sm text-[#9CA3AF] bg-[#141830] hover:bg-[#1A1F3A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#EF4444] hover:opacity-90 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}