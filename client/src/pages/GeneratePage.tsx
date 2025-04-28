import { useState } from "react"
import { Link } from "react-router-dom"

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

    return (
        <div className='flex flex-col justify-center items-center min-h-screen'>
            <div className='flex flex-col'>
                <div className='w-full group'>
                    <Link
                        className='bg-[#45474b] text-white font-medium px-5 py-3 rounded-tl-xl rounded-tr-xl mr-1 cursor-pointer transition duration-200 ease-in-out hover:bg-[#787983]'
                        to='/'
                    >
                        <button className='cursor-pointer'>Home</button>
                    </Link>
                    <Link
                        className='bg-[#787983] text-white font-medium px-5 py-3 rounded-tl-xl rounded-tr-xl mr-1 cursor-pointer transition duration-200 ease-in-out hover:bg-[#787983] group-hover:bg-[#45474b]'
                        to='/generate-password'
                    >
                        <button className='cursor-pointer'>Generate</button>
                    </Link>
                    <Link
                        className='bg-[#45474b] text-white font-medium px-5 py-3 rounded-tl-xl rounded-tr-xl mr-1 cursor-pointer transition duration-200 ease-in-out hover:bg-[#787983]'
                        to='/history-password'
                    >
                        <button className='cursor-pointer'>History</button>
                    </Link>
                    <Link
                        className='bg-[#45474b] text-white font-medium px-5 py-3 rounded-tl-xl rounded-tr-xl mr-1 cursor-pointer transition duration-200 ease-in-out hover:bg-[#787983]'
                        to='/check-password'
                    >
                        <button className='cursor-pointer'>Check</button>
                    </Link>
                </div>

                <div className='flex flex-col justify-center items-center bg-[#222730] text-white px-10 py-20 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl gap-2'>
                    <h1 className="font-bold text-4xl mb-4">Generate Password</h1>

                    <div>
                        <label>
                            Password Length
                            <input
                                type="number"
                                value={length}
                                onChange={(e) => setLength(Math.max(4, Math.min(20, parseInt(e.target.value, 10))))}
                                min={4}
                                max={20}
                                className="ml-2 px-2 py-1 bg-gray-800 text-white rounded"
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Include Digits
                            <input
                                type="checkbox"
                                checked={includeDigits}
                                onChange={(e) => setIncludeDigits(e.target.checked)}
                                className="ml-2 px-2 py-1 bg-gray-800 text-white rounded"
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Include Uppercase Letters
                            <input
                                type="checkbox"
                                checked={includeUppercase}
                                onChange={(e) => setIncludeUppercase(e.target.checked)}
                                className="ml-2 px-2 py-1 bg-gray-800 text-white rounded"
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Include Lowercase Letters
                            <input
                                type="checkbox"
                                checked={includeLowercase}
                                onChange={(e) => setIncludeLowercase(e.target.checked)}
                                className="ml-2 px-2 py-1 bg-gray-800 text-white rounded"
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Include Special Characters
                            <input
                                type="checkbox"
                                checked={includeSpecialChars}
                                onChange={(e) => setIncludeSpecialChars(e.target.checked)}
                                className="ml-2 px-2 py-1 bg-gray-800 text-white rounded"
                            />
                        </label>
                    </div>

                    <button
                        onClick={generatePassword}
                        className="mt-4 bg-[#d38951] hover:bg-[#8c584c] text-white px-6 py-2 rounded-lg text-lg"
                    >
                        Generate Password
                    </button>

                    {password && (
                        <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                            <h2 className="text-lg">
                                Generated Password: <span className="font-bold text-[#d38951]">{password}</span>
                            </h2>
                            <h3 className="text-md">Strength Score: {strengthScore}/5</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GeneratePage