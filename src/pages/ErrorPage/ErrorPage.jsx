import { Link, useRouteError } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const ErrorPage = () => {
    const error = useRouteError(); // Optional: to show specific error

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden font-sans">
            
            {/* Background Effects */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>

            {/* Glitch Effect Text 404 */}
            <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 relative z-10 drop-shadow-2xl">
                404
            </h1>
            
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-3xl mt-8 max-w-md shadow-2xl relative z-10">
                <FaExclamationTriangle className="text-5xl text-yellow-500 mx-auto mb-4 animate-bounce" />
                
                <h2 className="text-3xl font-bold text-white mb-2">Page Not Found</h2>
                <p className="text-gray-400 mb-6">
                    Oops! It looks like you've wandered into the unknown. The page you are looking for doesn't exist or an error occurred.
                </p>
                
                {/* Optional Error Details */}
                {error && (
                    <p className="text-red-400 text-sm mb-4 bg-gray-900/50 p-2 rounded">
                        <i>{error.statusText || error.message}</i>
                    </p>
                )}

                <Link to="/">
                    <button className="btn btn-primary btn-lg w-full rounded-2xl shadow-lg shadow-blue-900/50 bg-gradient-to-r from-blue-600 to-indigo-600 border-none text-white font-bold">
                        <FaHome className="mr-2" /> Back to Home
                    </button>
                </Link>
            </div>

            {/* CSS Animation for Glitch Text (Optional Polish) */}
            <style>{`
                @keyframes glitch {
                    0% { transform: translate(0) }
                    20% { transform: translate(-2px, 2px) }
                    40% { transform: translate(-2px, -2px) }
                    60% { transform: translate(2px, 2px) }
                    80% { transform: translate(2px, -2px) }
                    100% { transform: translate(0) }
                }
            `}</style>
        </div>
    );
};

export default ErrorPage;