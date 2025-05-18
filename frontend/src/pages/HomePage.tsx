import { Link } from 'react-router-dom'

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4">
            <div className="max-w-md md:max-w-lg lg:max-w-xl text-center">
                <div className="mb-6 transform hover:scale-105 transition-transform duration-300 cursor-default">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#222730] mb-2">
                        Pass<span className="text-[#d38951]">Cheq</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 font-medium">
                        Your #1 Password Manager | Secure & Reliable
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <h2 className="text-xl font-semibold text-[#222730] mb-2">Generate</h2>
                        <p className="text-gray-600 mb-4">Create strong, customized passwords instantly</p>
                        <Link to="/generate-password">
                            <button className="w-full bg-[#222730] text-white py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-[#45474b]">
                                Generate
                            </button>
                        </Link>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <h2 className="text-xl font-semibold text-[#222730] mb-2">Check</h2>
                        <p className="text-gray-600 mb-4">Verify the strength of your existing passwords</p>
                        <Link to="/check-password">
                            <button className="w-full bg-[#222730] text-white py-2 px-4 rounded transition duration-200 ease-in-out hover:bg-[#45474b]">
                                Check
                            </button>
                        </Link>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#d38951]">
                    <h2 className="text-xl font-semibold text-[#222730] mb-4">Why PassCheq?</h2>
                    <ul className="text-left space-y-2 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-[#d38951] mr-2">&#10003;</span>
                            <span>Strong encryption for maximum security</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-[#d38951] mr-2">&#10003;</span>
                            <span>Customizable password options</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-[#d38951] mr-2">&#10003;</span>
                            <span>Store and manage your password history</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-[#d38951] mr-2">&#10003;</span>
                            <span>Check password strength and vulnerability</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <footer className="mt-12 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} PassCheq. All rights reserved.</p>
                <p className="mt-1">Secure your digital life with confidence.</p>
            </footer>
        </div>
    )
}

export default HomePage