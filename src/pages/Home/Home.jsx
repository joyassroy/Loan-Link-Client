import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion"; // npm install framer-motion
import { Link } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Home = () => {
    const axiosPublic = useAxiosPublic();

    // Fetch Featured Loans (You can limit this on server side or slice here)
    const { data: loans = [] } = useQuery({
        queryKey: ['featured-loans'],
        queryFn: async () => {
            const res = await axiosPublic.get('/loans');
            // Filter locally for now (or create a backend query endpoint)
            const featured = res.data.filter(loan => loan.showOnHome === true);
            return featured.length > 0 ? featured : res.data.slice(0, 3); // Fallback to first 3 if none featured
        }
    });

    return (
        <div>
            {/* 1. Hero Section with Framer Motion */}
            <div className="hero min-h-[500px] bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <motion.h1 
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="text-5xl font-bold"
                        >
                            LoanLink Finance
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="py-6"
                        >
                            Empowering your dreams with fast, secure, and reliable microloans. 
                            Apply today and get funded tomorrow.
                        </motion.p>
                        <Link to="/all-loans" className="btn btn-primary">Explore Loans</Link>
                    </div>
                </div>
            </div>

            {/* 2. Featured Loans Section */}
            <div className="my-16 px-4">
                <h2 className="text-4xl text-center font-bold mb-10">Featured Loans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loans.map(loan => (
                        <div key={loan._id} className="card bg-base-100 shadow-xl border hover:border-primary transition-all">
                            <figure><img src={loan.image || "https://placehold.co/600x400"} alt="Loan" className="h-48 w-full object-cover" /></figure>
                            <div className="card-body">
                                <h2 className="card-title">{loan.title}</h2>
                                <div className="badge badge-secondary">{loan.category}</div>
                                <p>{loan.description?.slice(0, 100)}...</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="font-bold text-lg text-primary">{loan.interestRate}% Interest</span>
                                    <Link to={`/loan/${loan._id}`} className="btn btn-outline btn-sm">View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Success Stories / Testimonials */}
            <div className="my-16 bg-neutral text-neutral-content p-10 rounded-box">
                <h2 className="text-3xl text-center mb-8">Success Stories</h2>
                <div className="carousel w-full">
                    <div id="item1" className="carousel-item w-full flex flex-col items-center">
                        <p className="text-xl italic">"LoanLink helped me start my small bakery business!"</p>
                        <span className="mt-4 font-bold">- Sarah J.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;