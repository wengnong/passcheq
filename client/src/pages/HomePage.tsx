import { Link } from 'react-router-dom'

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen gap-2">
            <h1 className="text-black text-6xl font-bold">PassCheq</h1>
            <span className="text-black w-1/2 text-center">
                Your #1 Password Manager
                <br />
                Secure & Reliable
            </span>

            <Link to="/generate-password">
                <button className="bg-black text-white py-4 px-6 rounded-full text-sm font-medium cursor-pointer transition duration-200 ease-in-out hover:bg-[#d38951]">
                    Start Generating!
                </button>
            </Link>
        </div>
    );
};

export default HomePage