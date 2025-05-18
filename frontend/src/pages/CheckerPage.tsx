import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const CheckerPage: React.FC = () => {
    const [password, setPassword] = useState<string>("");
    const [results, setResults] = useState<null | {
        score: number;
        feedback: {
            warning: string;
            suggestions: string[];
        };
        time_to_crack: string;
        has_been_breached: boolean;
    }>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const checkPasswordStrength = () => {
        if (!password.trim()) {
            setError("Please enter a password to check");
            setResults(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        fetch('https://passcheq-production.up.railway.app/check-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            setResults(data);

            const savedChecks = JSON.parse(localStorage.getItem("passwordChecks") || "[]");
            const newCheck = {
                id: Date.now(),
                password: password.charAt(0) + "****" + password.charAt(password.length - 1),
                score: data.score,
                date: new Date().toLocaleString()
            };
            localStorage.setItem("passwordChecks", JSON.stringify([...savedChecks, newCheck]));
        })
        .catch(err => {
            setError("An error occurred while checking your password. Please try again.");
            console.error("Password check error:", err);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };
    
    const getScoreColor = (score: number) => {
        if (score <= 1) return "text-red-500";
        if (score === 2) return "text-orange-500";
        if (score === 3) return "text-yellow-500";
        if (score === 4) return "text-green-400";
        return "text-green-500";
    };
    
    const getScoreText = (score: number) => {
        if (score === 0) return "Very Weak";
        if (score === 1) return "Weak";
        if (score === 2) return "Fair";
        if (score === 3) return "Good";
        if (score === 4) return "Strong";
        return "Very Strong";
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4">
            <Navbar />
            
            <div className="w-full max-w-md md:max-w-lg flex flex-col justify-center items-center bg-[#222730] text-white px-4 sm:px-6 md:px-10 py-8 md:py-12 rounded-lg shadow-md shadow-black/40">
                <h1 className="font-bold text-3xl md:text-4xl mb-6 text-center">Check Password Strength</h1>
                
                <div className="w-full space-y-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-lg font-medium">
                            Enter a password to check:
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        checkPasswordStrength();
                                    }
                                }}
                                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d38951]"
                                placeholder="Enter password"
                            />
                            <button
                                onClick={checkPasswordStrength}
                                disabled={isLoading}
                                className={`bg-[#d38951] hover:bg-[#c07845] text-white px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#d38951] focus:ring-opacity-50 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Checking...' : 'Check'}
                            </button>
                        </div>
                        {error && (
                            <p className="text-red-400 text-sm">{error}</p>
                        )}
                    </div>
                    
                    {results && (
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold mb-2">Password Strength:</h2>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-full h-3 bg-gray-700 rounded-full">
                                        <div 
                                            className={`absolute top-0 left-0 h-3 rounded-full ${
                                                results.score <= 1 ? 'bg-red-500' : 
                                                results.score === 2 ? 'bg-orange-500' : 
                                                results.score === 3 ? 'bg-yellow-500' :
                                                results.score === 4 ? 'bg-green-400' : 'bg-green-500'
                                            }`} 
                                            style={{ width: `${(results.score / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className={`font-bold ${getScoreColor(results.score)}`}>
                                        {getScoreText(results.score)}
                                    </span>
                                </div>
                            </div>
                            
                            {results.feedback.warning && (
                                <div className="mb-4">
                                    <h3 className="font-semibold text-red-400">Warning:</h3>
                                    <p className="text-red-300">{results.feedback.warning}</p>
                                </div>
                            )}
                            
                            {results.feedback.suggestions.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="font-semibold text-blue-400">Suggestions:</h3>
                                    <ul className="list-disc list-inside text-blue-300">
                                        {results.feedback.suggestions.map((suggestion, index) => (
                                            <li key={index}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div className="bg-gray-800 p-3 rounded">
                                    <h3 className="font-semibold">Estimated crack time:</h3>
                                    <p className={results.time_to_crack === "instantly" ? "text-red-400" : "text-green-400"}>
                                        {results.time_to_crack}
                                    </p>
                                </div>
                                
                                <div className="bg-gray-800 p-3 rounded">
                                    <h3 className="font-semibold">Data breach:</h3>
                                    {results.has_been_breached ? (
                                        <p className="text-red-400">
                                            This password appears in known data breaches!
                                        </p>
                                    ) : (
                                        <p className="text-green-400">
                                            No breaches found
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            {results.score <= 2 && (
                                <div className="mt-4 bg-blue-900 bg-opacity-30 p-3 rounded border border-blue-700">
                                    <h3 className="font-semibold text-blue-300">Need a stronger password?</h3>
                                    <p className="text-white mb-2">Generate a secure password with our password generator.</p>
                                    <Link to="/generate-password">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                                            Generate Strong Password
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Password Strength Tips</h2>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start">
                                <span className="text-[#d38951] mr-2">•</span>
                                <span>Use at least 12 characters, combining uppercase, lowercase, numbers, and special characters</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#d38951] mr-2">•</span>
                                <span>Avoid common words, phrases, and predictable patterns</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#d38951] mr-2">•</span>
                                <span>Don't use personal information like birthdays or names</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#d38951] mr-2">•</span>
                                <span>Use different passwords for different accounts</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckerPage