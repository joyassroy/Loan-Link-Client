import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaCheckCircle, FaMoneyBillWave, FaUserCheck, FaHandHoldingUsd, FaRegStar, FaQuoteLeft, FaInfoCircle } from "react-icons/fa";

const Home = () => {
    const axiosPublic = useAxiosPublic();

    // --- 1. DATA FETCHING ---
    const { data: loans = [], isLoading } = useQuery({
        queryKey: ['featured-loans'], 
        queryFn: async () => {
            const res = await axiosPublic.get('/loans');
            return res.data;
        }
    });

    const featuredLoans = loans.slice(0, 6);

    // --- ANIMATION VARIANTS ---
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="font-sans text-gray-800 overflow-x-hidden">

            {/* --- SECTION 1: HERO BANNER (Fixed Buttons) --- */}
            <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white min-h-[85vh] flex items-center overflow-hidden">
                
                {/* Background Shapes */}
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"
                />
                <motion.div 
                    animate={{ scale: [1, 1.5, 1], x: [0, 50, 0] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"
                />

                <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-20 pb-20">
                    {/* Left Text */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="space-y-8"
                    >
                        <motion.div variants={fadeInUp} className="inline-block">
                            <span className="badge badge-accent badge-outline font-bold p-4 text-sm uppercase tracking-widest bg-accent/10">
                                🚀 Fast & Secure Loans
                            </span>
                        </motion.div>
                        
                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                            Your Dreams, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Our Priority.</span>
                        </motion.h1>
                        
                        <motion.p variants={fadeInUp} className="text-lg text-gray-300 max-w-lg leading-relaxed">
                            Experience the hassle-free way to get funded. Low interest rates, instant approval, and zero hidden fees.
                        </motion.p>
                        
                        {/* ✅ FIX: Buttons Container */}
                        <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
                            <Link to="/all-loans">
                                <button className="btn btn-primary btn-lg rounded-full px-8 shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform border-none bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold h-14 min-w-[180px]">
                                    Apply Now <FaArrowRight />
                                </button>
                            </Link>
                            
                            {/* Added Secondary Button for Balance */}
                            <Link to="/about">
                                <button className="btn btn-outline text-white btn-lg rounded-full px-8 hover:bg-white hover:text-gray-900 hover:scale-105 transition-transform font-bold h-14 min-w-[160px]">
                                    Learn More <FaInfoCircle />
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div 
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative hidden md:block"
                    >
                        <div className="absolute inset-0 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                        <img 
                            src="https://img.freepik.com/free-vector/digital-wallet-concept-illustration_114360-7561.jpg" 
                            alt="Loan App" 
                            className="relative w-full max-w-lg mx-auto drop-shadow-2xl rounded-3xl transform rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white/10"
                        />
                    </motion.div>
                </div>
            </div>

            {/* --- SECTION 2: STATS (Perfectly Centered) --- */}
            <div className="relative z-20 container mx-auto px-4 -mt-17">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 py-8 px-6 md:px-12 border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 items-center max-w-6xl mx-auto"
                >
                    {[
                        { icon: <FaUserCheck />, count: "15K+", label: "Happy Users", color: "text-blue-600" },
                        { icon: <FaMoneyBillWave />, count: "$12M+", label: "Disbursed", color: "text-green-600" },
                        { icon: <FaHandHoldingUsd />, count: "99%", label: "Approval", color: "text-purple-600" },
                        { icon: <FaCheckCircle />, count: "24/7", label: "Support", color: "text-orange-600" },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center gap-2 group p-4">
                            {/* Icon with Hover Bounce */}
                            <div className={`text-4xl ${stat.color} group-hover:-translate-y-2 transition-transform duration-300 drop-shadow-sm`}>
                                {stat.icon}
                            </div>
                            
                            {/* Text Content */}
                            <div className="text-center">
                                <h3 className="text-3xl font-extrabold text-gray-800 leading-tight">
                                    {stat.count}
                                </h3>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1 group-hover:text-blue-600 transition-colors">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
            {/* --- SECTION 3: AVAILABLE LOANS --- */}
            <div className="container mx-auto px-6 py-24">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.span 
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} 
                        className="text-blue-600 font-bold uppercase tracking-wider text-sm"
                    >
                        Our Packages
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
                        className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2"
                    >
                        Find the Perfect Loan
                    </motion.h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center"><span className="loading loading-dots loading-lg text-primary"></span></div>
                ) : (
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {featuredLoans.map(loan => (
                            <motion.div 
                                key={loan._id} 
                                variants={fadeInUp}
                                whileHover={{ y: -10 }}
                                className="card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 rounded-3xl overflow-hidden group h-full flex flex-col"
                            >
                                <figure className="relative h-56 overflow-hidden flex-shrink-0">
                                    <img src={loan.image} alt={loan.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase text-gray-800 shadow-sm">
                                        {loan.category}
                                    </div>
                                </figure>
                                
                                <div className="card-body p-6 flex-grow flex flex-col">
                                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{loan.title}</h3>
                                    <p className="text-gray-500 text-sm mt-2 line-clamp-2 flex-grow">{loan.description}</p>
                                    
                                    <div className="mt-4 p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Max Limit</p>
                                            <p className="text-lg font-extrabold text-blue-600">${loan.maxLoanLimit || loan.maxLimit}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold uppercase">Interest</p>
                                            <p className="text-lg font-extrabold text-gray-800">{loan.interest || loan.interestRate}%</p>
                                        </div>
                                    </div>

                                    {/* ✅ FIX: Button Spacing in Card */}
                                    <div className="mt-6">
                                        <Link to={`/loans/${loan._id}`} className="block w-full">
                                            <button className="btn btn-outline btn-primary w-full rounded-xl hover:bg-blue-600 hover:text-white font-bold border-2 h-12">
                                                View Details
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* --- SECTION 4: HOW IT WORKS --- */}
            <div className="bg-gray-50 py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-5"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">How It Works</h2>
                        <p className="text-gray-500 mt-3">Get funded in 3 simple steps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 -z-0 rounded-full"></div>
                        
                        {[
                            { step: "01", title: "Apply Online", desc: "Fill out our secure application form in minutes.", color: "border-blue-500 text-blue-600" },
                            { step: "02", title: "Get Verified", desc: "Our system verifies your details instantly.", color: "border-purple-500 text-purple-600" },
                            { step: "03", title: "Receive Funds", desc: "Money sent directly to your bank account.", color: "border-green-500 text-green-600" }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.2 }}
                                viewport={{ once: true }}
                                className="text-center relative z-10 bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100"
                            >
                                <div className={`w-20 h-20 bg-white border-4 ${item.color} rounded-full flex items-center justify-center mx-auto shadow-lg mb-6 text-2xl font-extrabold`}>
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                                <p className="text-gray-500 mt-2">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- SECTION 5: CUSTOMER FEEDBACK --- */}
            <div className="container mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">What Our Clients Say</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: "Sarah Johnson", role: "Small Business Owner", review: "LoanLink helped me expand my boutique when no one else would. The process was incredibly fast!" },
                        { name: "Michael Chen", role: "Freelancer", review: "The low interest rates and flexible repayment options are a lifesaver. Highly recommended!" },
                        { name: "Emily Davis", role: "Student", review: "Got my education loan approved in just 24 hours. Their support team is amazing." }
                    ].map((review, idx) => (
                        <motion.div 
                            key={idx}
                            whileHover={{ scale: 1.03 }}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative"
                        >
                            <FaQuoteLeft className="text-4xl text-blue-100 absolute top-6 left-6" />
                            <p className="text-gray-600 italic mt-8 relative z-10 min-h-[80px]">"{review.review}"</p>
                            <div className="flex items-center gap-1 text-yellow-400 mt-4">
                                {[...Array(5)].map((_, i) => <FaRegStar key={i} fill="currentColor" />)}
                            </div>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                                        <span className="text-lg">{review.name[0]}</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{review.name}</h4>
                                    <p className="text-xs text-gray-500">{review.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- SECTION 6: WHY CHOOSE US --- */}
            <div className="bg-gray-900 text-white py-24">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Why Choose <span className="text-blue-400">LoanLink?</span></h2>
                        <p className="text-gray-400 mb-8 text-lg">We combine technology with trust to bring you the best financial services.</p>
                        <div className="space-y-4">
                            {["Lowest Interest Rates in the Market", "100% Online Paperless Process", "Instant Disbursement to Bank", "No Pre-payment Penalties"].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <FaCheckCircle className="text-green-400 flex-shrink-0" />
                                    <span className="font-medium">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                        <Link to="/all-loans">
                            <button className="btn btn-warning mt-8 rounded-full px-8 font-bold h-12 shadow-lg hover:shadow-yellow-400/20">Get Started Now</button>
                        </Link>
                    </div>
                    <div className="md:w-1/2">
                         <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
                            <img 
                                src="https://img.freepik.com/free-vector/investment-data-concept-illustration_114360-5159.jpg" 
                                alt="Why Choose Us" 
                                className="relative rounded-3xl shadow-2xl border-4 border-gray-700 w-full"
                            />
                         </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;