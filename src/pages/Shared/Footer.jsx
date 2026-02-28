import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

// --- CUSTOM LL ICON (Same as Navbar & Home) ---
const LLIcon = ({ size = "w-10 h-10", strokeWidth = "8" }) => (
    <svg viewBox="0 0 100 100" className={`${size} drop-shadow-lg`}>
        <defs>
            <linearGradient id="footerLLGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
        <path d="M 30 15 V 85 H 15 M 15 15 V 85 H 60 Q 65 85 65 80 V 65 H 40 Q 35 65 35 70 V 85" 
              fill="none" stroke="url(#footerLLGradient)" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Footer = () => {
    return (
        <footer className="bg-base-100 text-base-content pt-24 pb-12 border-t border-base-content/5 relative overflow-hidden">
            {/* Background Glow Deco */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                    
                    {/* Brand Section - 4 Columns */}
                    <div className="md:col-span-4 space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <LLIcon size="w-12 h-12" strokeWidth="10" />
                            <div className="flex flex-col leading-none">
                                <span className="text-3xl font-[1000] uppercase tracking-tighter text-base-content group-hover:text-primary transition-colors">
                                    Loan<span className="text-primary italic group-hover:text-base-content">Link</span>
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Financial Protocol</span>
                            </div>
                        </Link>
                        <p className="text-lg font-medium opacity-60 leading-relaxed italic max-w-sm">
                            The next-gen AI lending protocol. Fast, secure, and transparent funding for the digital age.
                        </p>
                        <div className="flex gap-4">
                            {[FaFacebook, FaTwitter, FaLinkedin, FaYoutube].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-xl hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300">
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links - 2 Columns */}
                    <div className="md:col-span-2">
                        <h3 className="text-xs font-[1000] uppercase tracking-[0.3em] mb-8 text-primary opacity-80">Navigation</h3>
                        <ul className="space-y-4 text-sm font-black uppercase tracking-tight italic opacity-70">
                            <li><Link to="/" className="hover:text-primary hover:pl-2 transition-all block">Home</Link></li>
                            <li><Link to="/all-loans" className="hover:text-primary hover:pl-2 transition-all block">All Vaults</Link></li>
                            <li><Link to="/dashboard" className="hover:text-primary hover:pl-2 transition-all block">Dashboard</Link></li>
                            <li><Link to="/about" className="hover:text-primary hover:pl-2 transition-all block">About US</Link></li>
                        </ul>
                    </div>

                    {/* Services - 2 Columns */}
                    <div className="md:col-span-2">
                        <h3 className="text-xs font-[1000] uppercase tracking-[0.3em] mb-8 text-primary opacity-80">Services</h3>
                        <ul className="space-y-4 text-sm font-black uppercase tracking-tight italic opacity-70">
                            <li><a className="hover:text-primary transition-all cursor-pointer block">Personal</a></li>
                            <li><a className="hover:text-primary transition-all cursor-pointer block">Business</a></li>
                            <li><a className="hover:text-primary transition-all cursor-pointer block">Education</a></li>
                            <li><a className="hover:text-primary transition-all cursor-pointer block">Real Estate</a></li>
                        </ul>
                    </div>

                    {/* Newsletter - 4 Columns */}
                    <div className="md:col-span-4">
                        <h3 className="text-xs font-[1000] uppercase tracking-[0.3em] mb-8 text-primary opacity-80">Stay Linked</h3>
                        <p className="text-sm font-bold opacity-50 mb-6 italic uppercase tracking-tighter">Subscribe to our neural update channel.</p>
                        <div className="relative">
                            <input 
                                className="w-full bg-base-200 border-none rounded-[2rem] py-5 px-8 text-sm font-bold focus:ring-2 ring-primary transition-all outline-none italic placeholder:opacity-30" 
                                placeholder="YOUR@EMAIL.COM" 
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-primary text-white rounded-full px-6 flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-primary/20">
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-24 pt-10 border-t border-base-content/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">
                        &copy; {new Date().getFullYear()} LoanLink Protocol. Encrypted & Verified.
                    </p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-40 italic">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors">Nodes</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;