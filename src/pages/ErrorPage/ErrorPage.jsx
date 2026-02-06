import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 text-center p-4">
            {/* 404 Graphic or Text */}
            <h1 className="text-9xl font-extrabold text-primary">404</h1>
            
            <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
            <p className="py-6 text-lg max-w-md">
                Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            
            {/* Optional: Show technical error if available */}
            {error && (
                <p className="text-sm text-red-400 mb-6">
                    <i>{error.statusText || error.message}</i>
                </p>
            )}

            {/* Back to Home Button */}
            <Link to="/" className="btn btn-primary btn-wide">
                Back to Home
            </Link>
        </div>
    );
};

export default ErrorPage;