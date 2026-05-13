import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000"; // Adjust to your backend URL

export default function AdminDashboard() {
    const { user, isLoaded } = useUser();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const navigate = useNavigate();

    const isAdmin = user?.publicMetadata?.role === "admin";

    useEffect(() => {
        if (isLoaded && !isAdmin) {
            navigate("/");
            return;
        }
        fetchUsers();
    }, [isLoaded, isAdmin, navigate]);

    const fetchUsers = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/admin/users`);
            const data = await resp.json();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleAccess = async (clerkId, currentStatus) => {
        setUpdating(clerkId);
        try {
            const resp = await fetch(`${API_BASE_URL}/admin/grant-access/${clerkId}?access=${!currentStatus}`, {
                method: "POST",
            });
            if (resp.ok) {
                setUsers(users.map(u => u.clerkUserId === clerkId ? { ...u, hasAccess: !currentStatus } : u));
            }
        } catch (err) {
            console.error("Failed to update access:", err);
        } finally {
            setUpdating(null);
        }
    };

    if (loading) return <div className="admin-loading">Loading Dashboard...</div>;

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1 className="text-gradient">Admin Management</h1>
            </div>

            <div className="admin-stats">
                <div className="admin-stat-card">
                    <span className="stat-label">Total Users</span>
                    <span className="stat-value">{users.length}</span>
                </div>
                <div className="admin-stat-card">
                    <span className="stat-label">Granted Access</span>
                    <span className="stat-value">{users.filter(u => u.hasAccess).length}</span>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Join Date</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.clerkUserId}>
                                <td>
                                    <div className="user-profile">
                                        <img src={u.imageUrl} alt="" className="user-avatar" />
                                        <div className="user-info">
                                            <span className="user-name">{u.name || "Anonymous"}</span>
                                            <span className="user-email">{u.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={`role-badge role-badge--${u.role}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-pill status-pill--${u.hasAccess ? "active" : "blocked"}`}>
                                        {u.hasAccess ? "Active" : "Locked"}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className={`btn-access ${u.hasAccess ? "btn-access--revoke" : "btn-access--grant"}`}
                                        onClick={() => toggleAccess(u.clerkUserId, u.hasAccess)}
                                        disabled={updating === u.clerkUserId}
                                    >
                                        {updating === u.clerkUserId ? "..." : (u.hasAccess ? "Revoke Access" : "Grant Access")}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
