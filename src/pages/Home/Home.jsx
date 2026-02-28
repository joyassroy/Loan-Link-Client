import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
    FaArrowRight, FaMoneyBillWave, FaUserCheck,
    FaShieldAlt, FaChartLine, FaPaperPlane, FaPlus, FaUniversity, FaUserEdit, FaFingerprint, FaFileContract, FaDropbox
} from "react-icons/fa";
import { useRef, useState, useEffect } from "react";

// --- Reusable LL Icon Component ---
const LLIcon = ({ size = "w-10 h-10", strokeWidth = "8" }) => (
    <svg viewBox="0 0 100 100" className={`${size} drop-shadow-2xl`}>
        <defs>
            <linearGradient id="llGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
        <path d="M 30 15 V 85 H 15 M 15 15 V 85 H 60 Q 65 85 65 80 V 65 H 40 Q 35 65 35 70 V 85" 
              fill="none" stroke="url(#llGradient)" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Home = () => {
    const axiosPublic = useAxiosPublic();
    const [isCut, setIsCut] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);
    const heroRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsCut(true), 1800);
        return () => clearTimeout(timer);
    }, []);

    const { data: loans = [], isLoading } = useQuery({
        queryKey: ['featured-loans'],
        queryFn: async () => {
            const res = await axiosPublic.get('/loans');
            return res.data;
        }
    });

    const banks = [
        "City Bank", "bKash", "BRAC Bank", "National Bank", "Dutch-Bangla Bank", "Islami Bank", "Eastern Bank", "Nagad"
    ];

    // --- Process Steps Data ---
    const processSteps = [
        { icon: <FaUserEdit />, title: "Apply", desc: "Submit your details via encrypted gateway." },
        { icon: <FaFingerprint />, title: "Verify", desc: "AI protocol performs biometric check." },
        { icon: <FaFileContract />, title: "Approve", desc: "Digital contract generated instantly." },
        { icon: <FaDropbox />, title: "Disburse", desc: "Funds transferred to your link-account." }
    ];

    const faqs = [
        { q: "How fast is the loan approval?", a: "With our AI-Link protocol, most applications are verified within 60 seconds." },
        { q: "Is my financial data secure?", a: "We use AES-256 bank-grade encryption and decentralized storage for maximum security." },
        { q: "What is the maximum loan limit?", a: "Limits vary by credit score, but our protocol supports up to $500,000 for verified users." }
    ];

    const { scrollYProgress } = useScroll();
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <div className="min-h-screen bg-base-100 text-base-content overflow-x-hidden selection:bg-primary selection:text-white font-sans">

            {/* --- 1. PAGE CUTTER INTRO --- */}
            <AnimatePresence>
                {!isCut && (
                    <div className="fixed inset-0 z-[200] flex pointer-events-none overflow-hidden">
                        <motion.div exit={{ x: "-100%" }} transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1], delay: 0.2 }} className="w-1/2 h-full bg-primary relative overflow-hidden">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[100vw] text-center text-white font-[1000] text-[12vw] uppercase italic leading-none tracking-tighter">LoanLink</div>
                        </motion.div>
                        <motion.div exit={{ x: "100%" }} transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1], delay: 0.2 }} className="w-1/2 h-full bg-primary relative overflow-hidden">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[100vw] text-center text-white font-[1000] text-[12vw] uppercase italic leading-none tracking-tighter">LoanLink</div>
                        </motion.div>
                        <motion.div initial={{ y: "110vh", x: "-50%" }} animate={{ y: "-110vh" }} transition={{ duration: 2, ease: "easeInOut" }} className="absolute left-1/2 top-0 z-[210] flex flex-col items-center h-full">
                            <FaPaperPlane className="text-white text-6xl -rotate-45 drop-shadow-2xl mb-1" />
                            <div className="w-[2px] h-full bg-white/40 shadow-[0_0_15px_white]" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0 }} animate={isCut ? { opacity: 1 } : {}} transition={{ duration: 0.6 }}>
                
                {/* --- 2. HERO SECTION --- */}
                <motion.section ref={heroRef} style={{ scale: heroScale, opacity: heroOpacity }} className="relative min-h-screen flex items-center justify-center -mt-16 pt-12 overflow-hidden">
                    <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20">
                        <div className="text-center lg:text-left lg:col-span-7 order-2 lg:order-1">
                            <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 shadow-inner">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Next-Gen AI Lending Protocol</span>
                            </motion.div>
                            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-[1000] leading-[0.85] tracking-tighter uppercase mb-8">Loan<span className="text-primary italic">Link</span></h1>
                            <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto lg:mx-0 opacity-70 mb-12 italic">Fastest, most secure, and transparent loan protocol built for the digital age.</p>
                            <Link to="/all-loans">
                                <button className="btn btn-primary btn-lg rounded-2xl px-12 h-16 shadow-2xl hover:scale-105 transition-all font-black uppercase italic tracking-wider">Apply for Funding <FaArrowRight className="ml-3" /></button>
                            </Link>
                        </div>
                        <div className="relative flex justify-center lg:col-span-5 order-1 lg:order-2 p-12">
                            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                                <div className="absolute inset-0">
                                    {[
                                        { color: "bg-cyan-400", duration: 5 },
                                        { color: "bg-blue-500", duration: 7 },
                                        { color: "bg-white", duration: 6 }
                                    ].map((dot, i) => (
                                        <motion.div key={i} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: dot.duration, ease: "linear" }} className="absolute inset-0 flex items-start justify-center">
                                            <div className={`w-3 h-3 rounded-full ${dot.color} shadow-[0_0_15px_rgba(34,211,238,0.5)] mt-2`} />
                                        </motion.div>
                                    ))}
                                </div>
                                <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative z-10 w-full h-full flex items-center justify-center">
                                    <LLIcon size="w-3/4 h-3/4" strokeWidth="5" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* --- 3. TRUSTED BANK BANNER --- */}
                <div className="w-full bg-base-200/50 py-12 border-y border-base-content/5 overflow-hidden flex relative group">
                    <motion.div 
                        animate={{ x: [0, "-100%"] }}
                        transition={{ 
                            repeat: Infinity, 
                            duration: 30, 
                            ease: "linear" 
                        }}
                        className="flex gap-24 items-center px-12 shrink-0"
                    >
                        {banks.map((bank, i) => (
                            <div key={`bank-1-${i}`} className="flex items-center gap-5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                                <FaUniversity className="text-3xl text-primary" />
                                <span className="text-4xl font-black uppercase italic tracking-tighter">{bank}</span>
                            </div>
                        ))}
                        {banks.map((bank, i) => (
                            <div key={`bank-2-${i}`} className="flex items-center gap-5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                                <FaUniversity className="text-3xl text-primary" />
                                <span className="text-4xl font-black uppercase italic tracking-tighter">{bank}</span>
                            </div>
                        ))}
                    </motion.div>
                    <motion.div 
                        animate={{ x: [0, "-100%"] }}
                        transition={{ 
                            repeat: Infinity, 
                            duration: 30, 
                            ease: "linear" 
                        }}
                        className="flex gap-24 items-center px-12 shrink-0"
                    >
                        {banks.map((bank, i) => (
                            <div key={`bank-3-${i}`} className="flex items-center gap-5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                                <FaUniversity className="text-3xl text-primary" />
                                <span className="text-4xl font-black uppercase italic tracking-tighter">{bank}</span>
                            </div>
                        ))}
                        {banks.map((bank, i) => (
                            <div key={`bank-4-${i}`} className="flex items-center gap-5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                                <FaUniversity className="text-3xl text-primary" />
                                <span className="text-4xl font-black uppercase italic tracking-tighter">{bank}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* --- 4. NEW SECTION: HOW IT WORKS (THE PROCESS) --- */}
                <section className="py-40 bg-base-100 relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-24">
                            <h2 className="text-6xl md:text-8xl font-[1000] uppercase mb-6 tracking-tighter italic leading-none">The <span className="text-primary underline underline-offset-8">Protocol</span></h2>
                            <p className="text-xl opacity-60 font-medium italic">Seamless transition from application to disbursement.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                            {/* The Animated Connector Line */}
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: false, amount: 0.8 }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                                className="absolute top-[60px] left-0 h-[2px] bg-gradient-to-r from-primary/10 via-primary to-primary/10 hidden lg:block z-0"
                            />

                            {processSteps.map((step, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.5 }}
                                    transition={{ duration: 0.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    className="bg-base-200 border border-base-content/5 p-10 rounded-[3rem] text-center group relative z-10 transition-all hover:bg-neutral hover:text-neutral-content group"
                                >
                                    <div className="w-24 h-24 rounded-full bg-base-100 border border-base-content/10 mx-auto mb-10 flex items-center justify-center relative z-20 group-hover:scale-110 group-hover:border-primary transition-all duration-500">
                                        <div className="text-primary text-5xl transform group-hover:-rotate-12 transition-transform">{step.icon}</div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-2xl z-0 animate-pulse" />
                                    </div>
                                    
                                    <h4 className="text-3xl font-[1000] uppercase mb-4 tracking-tighter group-hover:text-primary">{step.title}</h4>
                                    <p className="text-sm opacity-70 font-medium leading-relaxed italic">{step.desc}</p>
                                    
                                    {/* Number Indicator */}
                                    <div className="absolute top-8 right-10 text-8xl font-black opacity-[0.03] text-primary select-none">0{i+1}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 5. LOAN VAULTS --- */}
                <section className="py-40 bg-base-200/40 mt-10">
                    <div className="container mx-auto px-6">
                        <h2 className="text-6xl md:text-8xl font-[1000] uppercase mb-24 tracking-tighter italic">Loan <span className="text-primary underline underline-offset-8">Vaults</span></h2>
                        {isLoading ? (
                            <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {loans.slice(0, 6).map((loan) => (
                                    <motion.div key={loan._id} whileHover={{ y: -15 }} className="bg-base-100 rounded-[3.5rem] p-6 shadow-xl border border-base-content/5 group overflow-hidden transition-all">
                                        <div className="h-64 rounded-[2.8rem] overflow-hidden relative">
                                            <img src={loan.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-2xl font-black uppercase mb-6 truncate">{loan.title}</h3>
                                            <div className="flex items-center justify-between p-5 bg-base-200 rounded-[2rem]">
                                                <p className="text-2xl font-black text-primary">{loan.interest || loan.interestRate}%</p>
                                                <Link to={`/loans/${loan._id}`}>
                                                    <button className="w-14 h-14 bg-base-content text-base-100 rounded-2xl flex items-center justify-center hover:bg-primary transition-all"><FaArrowRight /></button>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* --- 6. FAQ SECTION --- */}
                <section className="py-40 bg-base-200/40 relative">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="text-center mb-24">
                            <h2 className="text-5xl md:text-7xl font-[1000] uppercase tracking-tighter leading-none mb-6">Common <span className="text-primary italic">Queries</span></h2>
                            <p className="text-lg opacity-60 font-medium italic">Everything you need to know about LoanLink.</p>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <motion.div key={i} className="bg-base-100 rounded-[2.5rem] border border-base-content/5 overflow-hidden transition-all shadow-lg hover:shadow-primary/5">
                                    <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full flex items-center justify-between p-8 text-left group">
                                        <span className="text-xl md:text-2xl font-black uppercase italic tracking-tight">{faq.q}</span>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${openFaq === i ? 'bg-primary text-white rotate-45' : 'bg-base-200'}`}>
                                            <FaPlus />
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                                                <div className="p-8 pt-0 text-lg opacity-70 font-medium leading-relaxed italic border-t border-base-content/5 mx-8">{faq.a}</div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

            </motion.div>
        </div>
    );
};

export default Home;