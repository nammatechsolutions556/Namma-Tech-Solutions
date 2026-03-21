import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from "../../services/api";
import StatCard from "../../components/StatCard/StatCard";
import Table from "../../components/Table/Table";

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        applications: 0,
        requests: 0,
        certificates: 0,
        messages: 0
    });
    const [recentRequests, setRecentRequests] = useState([]);
    const [recentMessages, setRecentMessages] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get("/dashboard");
                setStats(response.data.stats);
                setRecentRequests(response.data.recentRequests);
                setRecentMessages(response.data.recentMessages);
                setGraphData(response.data.graphData || []);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const reqColumns = ["Name", "Email", "Project", "Status"];
    const reqData = recentRequests.map(req => ({
        name: req.name,
        email: req.email || 'N/A', // Using appropriate field mapping
        project: req.project_title,
        status: req.status
    }));

    const msgColumns = ["Name", "Email", "Subject", "Date"];
    const msgData = recentMessages.map(msg => ({
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        date: new Date(msg.created_at).toLocaleDateString()
    }));

    if (loading) {
        return <div style={{ color: '#f9fafb' }}>Loading dashboard data...</div>;
    }

    return (
        <div style={{ padding: '0.5rem 0' }}>
            <h2 style={{ marginBottom: '2rem', color: '#f9fafb' }}>Dashboard Overview</h2>

            {/* Stats Section */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.5rem",
                marginBottom: "3rem"
            }}>
                <StatCard
                    title="Total Projects"
                    value={stats.projects}
                    icon="🚀"
                    color="#3b82f6"
                />
                <StatCard
                    title="Internship Apps"
                    value={stats.applications}
                    icon="👨‍🎓"
                    color="#10b981"
                />
                <StatCard
                    title="Project Requests"
                    value={stats.requests}
                    icon="📩"
                    color="#f59e0b"
                />
                <StatCard
                    title="Certificates"
                    value={stats.certificates}
                    icon="📜"
                    color="#9333ea"
                />
                <StatCard
                    title="Total Messages"
                    value={stats.messages}
                    icon="💬"
                    color="#ec4899"
                />
            </div>

            {/* Analytics Section */}
            <div style={{
                background: "rgba(255, 255, 255, 0.03)",
                padding: "2rem",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                marginBottom: "3rem",
                height: "400px"
            }}>
                <h3 style={{ marginBottom: "1.5rem", color: "#f9fafb" }}>Activity Overview (Last 6 Months)</h3>
                <div style={{ height: "350px", width: "100%", position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={100}>
                    <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc", borderRadius: '8px' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line type="monotone" dataKey="requests" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 8 }} name="Requests" />
                        <Line type="monotone" dataKey="applications" stroke="#10b981" strokeWidth={3} name="Applications" />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>

            {/* Tables Section */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
                <div>
                    <h3 style={{ marginBottom: '1rem', color: '#f9fafb' }}>Recent Project Requests</h3>
                    <Table columns={reqColumns} data={reqData.length > 0 ? reqData : [{ name: 'No pending requests', email: '', project: '', status: '' }]} />
                </div>

                <div>
                    <h3 style={{ marginBottom: '1rem', color: '#f9fafb' }}>Recent Messages</h3>
                    <Table columns={msgColumns} data={msgData.length > 0 ? msgData : [{ name: 'No messages', email: '', subject: '', date: '' }]} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;