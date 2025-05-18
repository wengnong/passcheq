import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavbarProps {
    logoText?: string;
    maxWidth?: string;
}

const Navbar: React.FC<NavbarProps> = ({ logoText = "PassCheq", maxWidth = "max-w-6xl" }) => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const location = useLocation();

    const isActive = (path: string): boolean => {
        if (path === "/" && location.pathname === "/") return true;
        if (path !== "/" && location.pathname.startsWith(path)) return true;
        return false;
    };

    const getLinkClass = (path: string, isMobile: boolean = false) => {
        const baseClass = isMobile 
            ? "block font-medium px-5 py-3 transition-all duration-200 border-l-4"
            : `font-medium px-5 py-2 rounded-lg transition-all duration-200 ease-in-out text-center`;
        
        const activeClass = isMobile 
            ? "bg-gray-800 text-[#d38951] border-[#d38951]" 
            : "bg-gray-800 text-[#d38951] shadow-md";
        
        const inactiveClass = isMobile 
            ? "text-gray-300 hover:bg-gray-800 hover:text-[#d38951] border-transparent" 
            : "text-gray-300 hover:bg-gray-800 hover:text-[#d38951]";
        
        return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
    };

    return (
        <div className="flex flex-col items-center bg-[#222730] sticky top-0 z-10 shadow-md shadow-black/40 mb-6 px-4 rounded-lg">
            <div className={`${maxWidth} px-4`}>
                {/* desktop & mobile header */}
                <div className="flex justify-between items-center py-4 gap-20">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-[#d38951] rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-white">{logoText}</span>
                    </Link>
                    
                    {/* desktop nav */}
                    <nav className="hidden md:flex items-center space-x-4" aria-label="Desktop navigation">
                        <Link
                            className={getLinkClass("/")}
                            to="/"
                        >
                            Home
                        </Link>
                        <Link
                            className={getLinkClass("/generate-password")}
                            to="/generate-password"
                        >
                            Generate
                        </Link>
                        <Link
                            className={getLinkClass("/check-password")}
                            to="/check-password"
                        >
                            Check
                        </Link>
                        <Link
                            className={getLinkClass("/history-password")}
                            to="/history-password"
                        >
                            History
                        </Link>
                    </nav>
                    
                    {/* mobile nav */}
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden bg-gray-800 text-white p-2 rounded-lg transition-colors hover:bg-gray-700 focus:outline-none"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        {menuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
                
                {/* mobile nav dropdown */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-64' : 'max-h-0'}`}>
                    <nav className="py-2" aria-label="Mobile navigation">
                        <Link
                            className={getLinkClass("/", true)}
                            to="/"
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            className={getLinkClass("/generate-password", true)}
                            to="/generate-password"
                            onClick={() => setMenuOpen(false)}
                        >
                            Generate
                        </Link>
                        <Link
                            className={getLinkClass("/check-password", true)}
                            to="/check-password"
                            onClick={() => setMenuOpen(false)}
                        >
                            Check
                        </Link>
                        <Link
                            className={getLinkClass("/history-password", true)}
                            to="/history-password"
                            onClick={() => setMenuOpen(false)}
                        >
                            History
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Navbar