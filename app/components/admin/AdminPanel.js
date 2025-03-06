"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const ADMIN_SECRET = "your-admin-secret-key"; // ✅ Move to .env for security

    useEffect(() => {
        const eventSource = new EventSource("/api/users");

        eventSource.onmessage = (event) => {
            try {
                const updatedUsers = JSON.parse(event.data);
                setUsers(updatedUsers);
            } catch (error) {
                console.error("Error parsing SSE data:", error);
            }
        };

        eventSource.onerror = (error) => {
            console.error("SSE Error:", error);
            eventSource.close();
        };

        return () => eventSource.close();
    }, []);

    const removeUser = async (username) => {
        try {
            await axios.delete("/api/admin/users", {
                headers: { Authorization: ADMIN_SECRET },
                data: { username }
            });
        } catch (error) {
            console.error("Error removing user:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Username</th>
                        <th className="border p-2">Country</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index} className="text-center">
                            <td className="border p-2">{user.username}</td>
                            <td className="border p-2">{user.country}</td>
                            <td className="border p-2">
                                <button onClick={() => removeUser(user.username)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
