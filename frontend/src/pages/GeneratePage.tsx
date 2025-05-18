import { useState } from 'react'
import Navbar from '../components/Navbar'

const GeneratePage: React.FC = () => {
    const [length, setLength] = useState<number>(12);
    const [includeDigits, setIncludeDigits] = useState<boolean>(false);
    const [includeUppercase, setIncludeUppercase] = useState<boolean>(false);
    const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
    const [includeSpecialChars, setIncludeSpecialChars] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [strengthScore, setStrengthScore] = useState<number>(0);

    const generatePassword = async () => {
        if (!includeDigits && !includeUppercase && !includeLowercase && !includeSpecialChars) {
            alert("Please select at least one character type.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/generate-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    length,
                    include_digits: includeDigits,
                    include_uppercase: includeUppercase,
                    include_lowercase: includeLowercase,
                    include_special_chars: includeSpecialChars,
                }),
            });

            const data = await response.json();
            if (data.error) {
                alert(data.error);
                return;
            }

            setPassword(data.password);
            setStrengthScore(data.strength_score);

            const savedPasswords = JSON.parse(localStorage.getItem("passwordHistory") || "[]") as {
                id: number;
                password: string;
                strength: number;
                date: string;
            }[];

            const newEntry = {
                id: Date.now(),
                password: data.password,
                strength: data.strength_score,
                date: new Date().toLocaleString()
            };

            localStorage.setItem("passwordHistory", JSON.stringify([...savedPasswords, newEntry]));

        } catch (error) {
            console.error(error);
            alert("Failed to generate password. Please try again.");
        }
    };

    const copyToClipboard = () => {
        if (password) {
            navigator.clipboard.writeText(password);
            alert("Password copied to clipboard!");
        }
    };

    return (
        <div className='flex flex-col justify-center items-center min-h-screen p-4'>
            <Navbar />

            <div className="w-full max-w-md md:max-w-lg lg:max-w-xl flex flex-col justify-center items-center bg-[#222730] text-white px-4 sm:px-6 md:px-10 py-8 md:py-12 rounded-lg shadow-md shadow-black/40">
                <h1 className="font-bold text-3xl md:text-4xl mb-6 text-center">Generate Password</h1>

                <div className="w-full space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <label className="font-medium mb-1 sm:mb-0">Password Length</label>
                        <input
                            type="range"
                            value={length}
                            onChange={(e) => setLength(parseInt(e.target.value, 10))}
                            min={4}
                            max={30}
                            className="w-full sm:w-1/2 accent-[#d38951]"
                        />
                        <span className="bg-gray-800 px-3 py-1 rounded-full min-w-10 text-center mt-1 sm:mt-0">{length}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 bg-gray-800 rounded-lg p-3 transition-all hover:bg-gray-700">
                            <input
                                type="checkbox"
                                id="digits"
                                checked={includeDigits}
                                onChange={(e) => setIncludeDigits(e.target.checked)}
                                className="w-5 h-5 accent-[#d38951]"
                            />
                            <label htmlFor="digits" className="flex-1 cursor-pointer">Include Digits</label>
                        </div>

                        <div className="flex items-center space-x-3 bg-gray-800 rounded-lg p-3 transition-all hover:bg-gray-700">
                            <input
                                type="checkbox"
                                id="uppercase"
                                checked={includeUppercase}
                                onChange={(e) => setIncludeUppercase(e.target.checked)}
                                className="w-5 h-5 accent-[#d38951]"
                            />
                            <label htmlFor="uppercase" className="flex-1 cursor-pointer">Include Uppercase</label>
                        </div>

                        <div className="flex items-center space-x-3 bg-gray-800 rounded-lg p-3 transition-all hover:bg-gray-700">
                            <input
                                type="checkbox"
                                id="lowercase"
                                checked={includeLowercase}
                                onChange={(e) => setIncludeLowercase(e.target.checked)}
                                className="w-5 h-5 accent-[#d38951]"
                            />
                            <label htmlFor="lowercase" className="flex-1 cursor-pointer">Include Lowercase</label>
                        </div>

                        <div className="flex items-center space-x-3 bg-gray-800 rounded-lg p-3 transition-all hover:bg-gray-700">
                            <input
                                type="checkbox"
                                id="special"
                                checked={includeSpecialChars}
                                onChange={(e) => setIncludeSpecialChars(e.target.checked)}
                                className="w-5 h-5 accent-[#d38951]"
                            />
                            <label htmlFor="special" className="flex-1 cursor-pointer">Include Special Chars</label>
                        </div>
                    </div>

                    <button
                        onClick={generatePassword}
                        className="w-full bg-[#d38951] hover:bg-[#c07845] text-white px-6 py-3 rounded-lg text-lg font-medium transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#d38951] focus:ring-opacity-50"
                    >
                        Generate Password
                    </button>

                    {password && (
                        <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-medium">Generated Password:</h2>
                                <button 
                                    onClick={copyToClipboard}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Copy
                                </button>
                            </div>
                            <div className="mt-2 p-3 bg-gray-800 rounded font-mono text-[#d38951] break-all">
                                {password}
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between">
                                    <span>Strength:</span>
                                    <span className={
                                        `font-bold ${
                                            strengthScore <= 2 ? 'text-red-500' : 
                                            strengthScore <= 3 ? 'text-yellow-500' : 
                                            'text-green-500'
                                        }`
                                    }>
                                        {strengthScore}/5
                                    </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                                    <div 
                                        className={`h-2.5 rounded-full ${
                                            strengthScore <= 2 ? 'bg-red-500' : 
                                            strengthScore <= 3 ? 'bg-yellow-500' : 
                                            'bg-green-500'
                                        }`} 
                                        style={{ width: `${(strengthScore / 5) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GeneratePage