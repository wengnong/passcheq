import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

interface PasswordEntry {
    id: number;
    password: string;
    strength: number;
    date: string;
}

const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<PasswordEntry[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("date");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        const savedPasswords = JSON.parse(localStorage.getItem("passwordHistory") || "[]") as PasswordEntry[];
        setHistory(savedPasswords);
    }, []);

    const copyToClipboard = (password: string) => {
        navigator.clipboard.writeText(password);
        alert("Password copied to clipboard!");
    };

    const deleteEntry = (id: number) => {
        const updatedHistory = history.filter((entry) => entry.id !== id);
        setHistory(updatedHistory);
        localStorage.setItem("passwordHistory", JSON.stringify(updatedHistory));
    };

    const clearHistory = () => {
        if (window.confirm("Are you sure you want to clear all password history?")) {
            setHistory([]);
            localStorage.removeItem("passwordHistory");
        }
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortDirection("asc");
        }
    };

    const getSortIcon = (field: string) => {
        if (sortBy !== field) return "⇅";
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const filteredAndSortedHistory = [...history]
        .filter(entry => 
            entry.password.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "strength") {
                return sortDirection === "asc" 
                    ? a.strength - b.strength 
                    : b.strength - a.strength;
            } else if (sortBy === "date") {
                return sortDirection === "asc" 
                    ? new Date(a.date).getTime() - new Date(b.date).getTime()
                    : new Date(b.date).getTime() - new Date(a.date).getTime();
            } else {
                return sortDirection === "asc"
                    ? a.password.localeCompare(b.password)
                    : b.password.localeCompare(a.password);
            }
        });

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4">
            <Navbar />

            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-4xl flex flex-col justify-center items-center bg-[#222730] text-white px-4 sm:px-6 md:px-10 py-8 md:py-12 rounded-lg shadow-md shadow-black/40">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Password History</h1>

                {history.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-xl mb-4">No password history found.</p>
                        <Link 
                            to="/generate-password"
                            className="inline-block bg-[#d38951] hover:bg-[#c07845] text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105"
                        >
                            Generate Your First Password
                        </Link>
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                            <div className="w-full sm:w-auto">
                                <input
                                    type="text"
                                    placeholder="Search passwords..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d38951]"
                                />
                            </div>
                            <button
                                onClick={clearHistory}
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition-colors"
                            >
                                Clear All History
                            </button>
                        </div>

                        <div className="overflow-x-auto w-full">
                            <table className="w-full border-collapse border border-gray-600">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th 
                                            className="border border-gray-600 px-2 sm:px-4 py-2 cursor-pointer hover:bg-gray-600"
                                            onClick={() => handleSort("password")}
                                        >
                                            Password {getSortIcon("password")}
                                        </th>
                                        <th 
                                            className="border border-gray-600 px-2 sm:px-4 py-2 cursor-pointer hover:bg-gray-600"
                                            onClick={() => handleSort("strength")}
                                        >
                                            Strength {getSortIcon("strength")}
                                        </th>
                                        <th 
                                            className="border border-gray-600 px-2 sm:px-4 py-2 cursor-pointer hover:bg-gray-600"
                                            onClick={() => handleSort("date")}
                                        >
                                            Date {getSortIcon("date")}
                                        </th>
                                        <th className="border border-gray-600 px-2 sm:px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedHistory.map((entry) => (
                                        <tr key={entry.id} className="border border-gray-600 hover:bg-gray-800">
                                            <td className="border border-gray-600 px-2 sm:px-4 py-2 font-mono">
                                                <div className="max-w-[120px] sm:max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {entry.password}
                                                </div>
                                            </td>
                                            <td className="border border-gray-600 px-2 sm:px-4 py-2">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    entry.strength <= 2 ? 'bg-red-900 text-red-200' : 
                                                    entry.strength <= 3 ? 'bg-yellow-900 text-yellow-200' : 
                                                    'bg-green-900 text-green-200'
                                                }`}>
                                                    {entry.strength}/5
                                                </span>
                                            </td>
                                            <td className="border border-gray-600 px-2 sm:px-4 py-2 whitespace-nowrap text-xs sm:text-sm">
                                                {entry.date}
                                            </td>
                                            <td className="border border-gray-600 px-2 sm:px-4 py-2">
                                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                                    <button
                                                        onClick={() => copyToClipboard(entry.password)}
                                                        className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs sm:text-sm transition-colors"
                                                    >
                                                        Copy
                                                    </button>
                                                    <button
                                                        onClick={() => deleteEntry(entry.id)}
                                                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs sm:text-sm transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="mt-4 text-gray-400 text-sm text-center">
                            {filteredAndSortedHistory.length} password{filteredAndSortedHistory.length !== 1 ? 's' : ''} found
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HistoryPage