import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaMoneyBillWave, FaUserFriends, FaHandHoldingUsd, FaRegCreditCard } from "react-icons/fa";

const Home = () => {
    const axiosPublic = useAxiosPublic();

    // --- 1. DATA FETCHING (Same Logic, No Change) ---
    const { data: loans = [], isLoading } = useQuery({
        queryKey: ['featured-loans'], 
        queryFn: async () => {
            const res = await axiosPublic.get('/loans');
            return res.data;
        }
    });

    // আমরা হোম পেজে সব লোন না দেখিয়ে, শুধু প্রথম ৩টা দেখাবো (Featured হিসেবে)
    const featuredLoans = loans.slice(0, 3);

    return (
        <div className="font-sans text-gray-800">

            {/* --- SECTION 1: HERO BANNER (Modern & Clean) --- */}
            <div className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 text-white overflow-hidden pb-20 pt-24 lg:pt-32">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2 space-y-6 animate-fade-in-up">
                        <div className="badge badge-warning p-3 font-bold text-xs uppercase tracking-wide">
                            🚀 Trusted by 10,000+ Users
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                            Empower Your <br />
                            <span className="text-blue-300">Financial Future</span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
                            Need funds for your business, education, or dream home? 
                            LoanLink provides fast, secure, and low-interest loans tailored for you.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link to="/all-loans">
                                <button className="btn btn-warning btn-lg font-bold rounded-full px-8 shadow-lg hover:scale-105 transition-transform">
                                    Get Started <FaArrowRight />
                                </button>
                            </Link>
                            <Link to="/about">
                                <button className="btn btn-outline text-white btn-lg rounded-full px-8 hover:bg-white hover:text-blue-900">
                                    Learn More
                                </button>
                            </Link>
                        </div>
                    </div>
                    {/* Hero Image / Illustration */}
                    <div className="md:w-1/2 flex justify-center relative">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                        <img 
                            src="https://img.freepik.com/free-vector/finance-app-interface-concept-illustration_114360-639.jpg?t=st=1708453489~exp=1708457089~hmac=..." 
                            alt="Banking App" 
                            className="relative rounded-3xl shadow-2xl border-4 border-white/10 w-4/5 md:w-full max-w-md transform hover:-rotate-2 transition-transform duration-500"
                        />
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: STATS BAR --- */}
            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 p-8 border border-gray-100">
                    <div className="text-center space-y-2 border-r last:border-none border-gray-100">
                        <FaUserFriends className="text-4xl text-blue-600 mx-auto" />
                        <h3 className="text-3xl font-extrabold text-gray-800">10K+</h3>
                        <p className="text-sm text-gray-500 font-bold uppercase">Active Users</p>
                    </div>
                    <div className="text-center space-y-2 border-r last:border-none border-gray-100">
                        <FaMoneyBillWave className="text-4xl text-green-500 mx-auto" />
                        <h3 className="text-3xl font-extrabold text-gray-800">$5M+</h3>
                        <p className="text-sm text-gray-500 font-bold uppercase">Disbursed</p>
                    </div>
                    <div className="text-center space-y-2 border-r last:border-none border-gray-100">
                        <FaCheckCircle className="text-4xl text-purple-500 mx-auto" />
                        <h3 className="text-3xl font-extrabold text-gray-800">98%</h3>
                        <p className="text-sm text-gray-500 font-bold uppercase">Approval Rate</p>
                    </div>
                    <div className="text-center space-y-2">
                        <FaHandHoldingUsd className="text-4xl text-orange-500 mx-auto" />
                        <h3 className="text-3xl font-extrabold text-gray-800">24H</h3>
                        <p className="text-sm text-gray-500 font-bold uppercase">Fast Processing</p>
                    </div>
                </div>
            </div>

            {/* --- SECTION 3: FEATURED LOANS (Dynamic Data) --- */}
            <div className="container mx-auto px-6 py-24">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Our Packages</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Find the Right Loan for You</h2>
                    <p className="text-gray-500 mt-4 text-lg">We offer a variety of loan packages with flexible terms and low interest rates.</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center"><span className="loading loading-bars loading-lg text-primary"></span></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredLoans.map(loan => (
                            <div key={loan._id} className="card bg-white hover:shadow-2xl transition-all duration-300 border border-gray-100 rounded-2xl overflow-hidden group">
                                <figure className="relative h-52 overflow-hidden">
                                    <img src={loan.image} alt={loan.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                                        {loan.category}
                                    </div>
                                </figure>
                                <div className="card-body p-6">
                                    <h3 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{loan.title}</h3>
                                    <p className="text-gray-500 line-clamp-2 mt-2">{loan.description || "Get the best financial support with this loan package."}</p>
                                    
                                    <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Interest</p>
                                            <p className="font-bold text-gray-800">{loan.interest || loan.interestRate}%</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold uppercase">Max Limit</p>
                                            <p className="font-bold text-blue-600">${loan.maxLoanLimit || loan.maxLimit}</p>
                                        </div>
                                    </div>
                                    <Link to={`/loans/${loan._id}`} className="mt-4">
                                        <button className="btn btn-outline btn-primary w-full rounded-xl hover:shadow-lg">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="text-center mt-12">
                    <Link to="/all-loans">
                        <button className="btn btn-link no-underline text-lg font-bold group">
                            View All Packages <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>

            {/* --- SECTION 4: HOW IT WORKS --- */}
            <div className="bg-gray-50 py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">How It Works</h2>
                        <p className="text-gray-500 mt-3">Get your loan approved in 3 simple steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
                        {/* Connecting Line (Desktop Only) */}
                        <div className="hidden md:block absolute top-12 left-20 right-20 h-1 bg-gray-200 -z-0"></div>

                        {/* Step 1 */}
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg mb-6 text-3xl font-bold text-blue-600">1</div>
                            <h3 className="text-xl font-bold text-gray-800">Apply Online</h3>
                            <p className="text-gray-500 mt-2 px-6">Fill out our simple application form with basic details.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-white border-4 border-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg mb-6 text-3xl font-bold text-purple-600">2</div>
                            <h3 className="text-xl font-bold text-gray-800">Get Approved</h3>
                            <p className="text-gray-500 mt-2 px-6">Our team reviews your application instantly.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-white border-4 border-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg mb-6 text-3xl font-bold text-green-600">3</div>
                            <h3 className="text-xl font-bold text-gray-800">Receive Funds</h3>
                            <p className="text-gray-500 mt-2 px-6">Money is transferred to your account within 24 hours.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECTION 5: CTA --- */}
            <div className="bg-blue-900 py-20 px-6 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                    <h2 className="text-4xl font-bold">Ready to take the next step?</h2>
                    <p className="text-blue-200 text-lg">Join thousands of satisfied customers who trust LoanLink for their financial needs.</p>
                    <Link to="/all-loans">
                        <button className="btn btn-warning btn-lg rounded-full px-10 shadow-xl hover:scale-105 transition-transform mt-4">
                            Apply Now
                        </button>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default Home;