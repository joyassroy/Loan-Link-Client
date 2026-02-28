import { useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaDollarSign, FaPercent, FaArrowRight, FaLayerGroup, FaRedo, FaSortAmountDown, FaUniversity } from "react-icons/fa";

const AllLoans = () => {
    const axiosPublic = useAxiosPublic();
    
    // --- STATE MANAGEMENT ---
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState(''); 
    const [page, setPage] = useState(0); 
    const size = 6; 

    // --- 1. FETCH TOTAL COUNT ---
    const { data: countData = { count: 0 } } = useQuery({
        queryKey: ['loansCount', search, category],
        queryFn: async () => {
            const res = await axiosPublic.get(`/loansCount?search=${search}&category=${category}`);
            return res.data;
        }
    });

    const totalCount = countData.count;
    const numberOfPages = Math.ceil(totalCount / size);
    const pages = [...Array(numberOfPages).keys()];

    // --- 2. FETCH LOANS ---
    const { data: loans = [], isLoading } = useQuery({
        queryKey: ['all-loans', page, size, search, category, sort], 
        queryFn: async () => {
            const res = await axiosPublic.get(`/loans?page=${page}&size=${size}&search=${search}&category=${category}&sort=${sort}`);
            return res.data;
        }
    });

    // --- HANDLERS ---
    const handleReset = () => {
        setSearch('');
        setCategory('');
        setSort('');
        setPage(0);
    };

    return (
        <div className="min-h-screen bg-base-200 text-base-content font-sans pb-32 transition-colors duration-300 overflow-hidden">
            
            {/* --- 1. PREMIUM HERO HEADER --- */}
            <div className="relative bg-neutral py-24 px-6 text-center overflow-hidden">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <FaUniversity className="text-[30rem] text-primary" />
                </motion.div>
                
                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                    <motion.h2 
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-6xl md:text-8xl font-[1000] uppercase tracking-tighter italic text-white leading-none"
                    >
                        Loan <span className="text-primary underline underline-offset-8">Vaults</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-primary-content/60 text-xl font-black uppercase tracking-[0.3em] italic"
                    >
                        Secure your future with AI-Driven Funding
                    </motion.p>
                </div>
            </div>

            {/* --- 2. SEARCH & FILTER CONSOLE --- */}
            <div className="container mx-auto px-6 -mt-16 relative z-30">
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-base-100 p-8 rounded-[3rem] shadow-2xl flex flex-col lg:flex-row gap-6 items-center border border-base-content/5"
                >
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
                        <input 
                            type="text" 
                            placeholder="PROTOCOL SEARCH..." 
                            className="input w-full pl-16 h-16 rounded-3xl bg-base-200 border-none font-black italic tracking-tighter focus:ring-2 ring-primary transition-all uppercase"
                            value={search}
                            onChange={(e) => {setSearch(e.target.value); setPage(0);}}
                        />
                    </div>

                    {/* Category */}
                    <div className="relative w-full lg:w-64">
                        <select 
                            className="select w-full h-16 rounded-3xl bg-base-200 border-none font-black italic tracking-tighter focus:ring-2 ring-primary transition-all uppercase px-8"
                            onChange={(e) => {setCategory(e.target.value); setPage(0);}}
                            value={category}
                        >
                            <option value="">All Sectors</option>
                            <option value="Personal">Personal</option>
                            <option value="Business">Business</option>
                            <option value="Home">Home</option>
                            <option value="Vehicle">Vehicle</option>
                            <option value="Education">Education</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="relative w-full lg:w-72">
                        <select 
                            className="select w-full h-16 rounded-3xl bg-base-200 border-none font-black italic tracking-tighter focus:ring-2 ring-primary transition-all uppercase px-8"
                            onChange={(e) => {setSort(e.target.value); setPage(0);}}
                            value={sort}
                        >
                            <option value="">Sort: Default</option>
                            <option value="limit-asc">Limit: Low to High</option>
                            <option value="limit-desc">Limit: High to Low</option>
                            <option value="interest-asc">Interest: Low to High</option>
                            <option value="interest-desc">Interest: High to Low</option>
                        </select>
                    </div>
                    
                    <button onClick={handleReset} className="btn btn-square h-16 w-16 rounded-3xl btn-primary text-xl shadow-lg shadow-primary/20">
                        <FaRedo />
                    </button>
                </motion.div>
            </div>

            {/* --- 3. GRID & CARDS --- */}
            <div className="container mx-auto px-6 mt-24">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div 
                            key="loader"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                        >
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-[500px] rounded-[4rem] bg-base-300/30 animate-pulse border border-base-content/5" />
                            ))}
                        </motion.div>
                    ) : loans.length > 0 ? (
                        <motion.div 
                            key="grid"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                        >
                            {loans.map((loan) => (
                                <motion.div 
                                    key={loan._id} 
                                    whileHover={{ y: -20 }}
                                    className="bg-base-100 rounded-[4rem] p-6 shadow-xl border border-base-content/5 group relative overflow-hidden"
                                >
                                    {/* Image Wrapper */}
                                    <div className="h-72 rounded-[3.5rem] overflow-hidden relative mb-8">
                                        <img src={loan.image} alt={loan.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                                        <div className="absolute top-6 right-6 px-6 py-2 bg-primary text-white font-[1000] italic uppercase tracking-widest text-[10px] rounded-full shadow-2xl">
                                            {loan.category}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-4 pb-4">
                                        <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter mb-8 group-hover:text-primary transition-colors leading-none">
                                            {loan.title}
                                        </h3>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-10">
                                            <div className="p-6 bg-base-200 rounded-[2.5rem] border border-base-content/5">
                                                <p className="text-[10px] font-black opacity-40 uppercase mb-2 tracking-widest">Cap Limit</p>
                                                <p className="text-2xl font-[1000] italic text-base-content tracking-tighter">${loan.maxLoanLimit || loan.maxLimit}</p>
                                            </div>
                                            <div className="p-6 bg-base-200 rounded-[2.5rem] border border-base-content/5">
                                                <p className="text-[10px] font-black opacity-40 uppercase mb-2 tracking-widest">Yield</p>
                                                <p className="text-2xl font-[1000] italic text-primary tracking-tighter">{loan.interest || loan.interestRate}%</p>
                                            </div>
                                        </div>

                                        <Link to={`/loans/${loan._id}`}>
                                            <button className="w-full h-20 bg-neutral text-white rounded-[2rem] font-[1000] uppercase italic tracking-widest flex items-center justify-center gap-4 hover:bg-primary transition-all shadow-xl">
                                                Initialize Apply <FaArrowRight />
                                            </button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-base-100 rounded-[4rem] border border-base-content/5 max-w-2xl mx-auto shadow-2xl">
                            <FaLayerGroup className="text-9xl text-primary/10 mx-auto mb-8" />
                            <h3 className="text-5xl font-[1000] uppercase tracking-tighter italic mb-4">No Vaults Found</h3>
                            <p className="text-base-content/50 font-black uppercase tracking-widest text-xs mb-10">Protocol could not locate matching records.</p>
                            <button onClick={handleReset} className="btn btn-primary rounded-full px-12 h-16 font-black uppercase italic tracking-widest">Reset System</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- 4. PAGINATION --- */}
                {numberOfPages > 1 && (
                    <div className="flex justify-center mt-32">
                        <div className="flex gap-4 p-4 bg-base-100 rounded-[3rem] shadow-2xl border border-base-content/5 overflow-x-auto max-w-full">
                            <button 
                                onClick={() => setPage(page > 0 ? page - 1 : 0)} 
                                disabled={page === 0}
                                className="h-16 px-8 rounded-[2rem] font-[1000] uppercase italic tracking-widest bg-base-200 hover:bg-primary hover:text-white transition-all disabled:opacity-20"
                            >
                                Prev
                            </button>

                            {pages.map(p => (
                                <button 
                                    key={p} 
                                    onClick={() => setPage(p)}
                                    className={`h-16 w-16 rounded-[2rem] font-[1000] transition-all ${page === p ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-base-200 hover:bg-base-300 opacity-50'}`}
                                >
                                    {p + 1}
                                </button>
                            ))}

                            <button 
                                onClick={() => setPage(page < numberOfPages - 1 ? page + 1 : page)} 
                                disabled={page === numberOfPages - 1}
                                className="h-16 px-8 rounded-[2rem] font-[1000] uppercase italic tracking-widest bg-base-200 hover:bg-primary hover:text-white transition-all disabled:opacity-20"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllLoans;