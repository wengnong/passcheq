import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

interface PasswordEntry {
    id: number;
    password: string;
    strength: number;
    date: string;
}

const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<PasswordEntry[]>([]);

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
        setHistory([]);
        localStorage.removeItem("passwordHistory");
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="flex flex-col">
                <div className="w-full group">
                    <Link
                        className="bg-[#45474b] text-white font-medium px-5 py-3 rounded-tl-xl rounded-tr-xl mr-1 cursor-pointer transition duration-200 ease-in-out hover:bg-[#787983]"
                        to="/"
                    >
                        <button className="cursor-pointer">Home</button>
                    </Link>
                    <Link
                        className="bg-[#787983] text-white font-medium px-5 py-3 rounded-tl-xl rounded-tr-xl mr-1 cursor-pointer transition duration-200 ease-in-out hover:bg-[#787983] group-hover:bg-[#45474b]"
                        to="/generate-password"
                    >
                        <button className="cursor-pointer">Generate</button>
                    </Link>
                    <Link
                        className="bg-[#45474b] text-white font-medium px-5 py-3 rounded-tl-xl rounded-tr-xl mr-1 cursor-pointer transition duration-200 ease-in-out hover:bg-[#787983]"
                        to="/history-password"
                    >
                        <button className="cursor-pointer">History</button>
                    </Link>
                    <Link
                        className="bg-[#45474b] text-white font-medium px-5 py-3 rounded-tl-xl rounded-tr-xl mr-1 cursor-pointer transition duration-200 ease-in-out hover:bg-[#787983]"
                        to="/check-password"
                    >
                        <button className="cursor-pointer">Check</button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center bg-[#222730] text-white px-10 py-20 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl gap-2">
                <h1 className="text-3xl font-bold mb-4">Password History</h1>

                {history.length === 0 ? (
                    <p>No password history found.</p>
                ) : (
                    <table className="w-full max-w-2xl border-collapse border border-gray-600">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="border border-gray-600 px-4 py-2">Password</th>
                                <th className="border border-gray-600 px-4 py-2">Strength</th>
                                <th className="border border-gray-600 px-4 py-2">Date</th>
                                <th className="border border-gray-600 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((entry) => (
                                <tr key={entry.id} className="border border-gray-600">
                                    <td className="border border-gray-600 px-4 py-2">{entry.password}</td>
                                    <td className="border border-gray-600 px-4 py-2">{entry.strength}/5</td>
                                    <td className="border border-gray-600 px-4 py-2">{entry.date}</td>
                                    <td className="border border-gray-600 px-4 py-2">
                                        <button
                                        onClick={() => copyToClipboard(entry.password)}
                                        className="bg-blue-500 px-3 py-1 mr-2 rounded text-white"
                                        >
                                            Copy
                                        </button>
                                        <button
                                        onClick={() => deleteEntry(entry.id)}
                                        className="bg-red-500 px-3 py-1 rounded text-white"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {history.length > 0 && (
                    <button
                        onClick={clearHistory}
                        className="mt-4 bg-red-600 px-6 py-2 rounded text-white"
                    >
                        Clear All
                    </button>
                )}
            </div>
        </div>
    )
}

export default HistoryPage
