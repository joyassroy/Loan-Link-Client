import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="text-2xl font-extrabold tracking-wide text-white flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center text-white text-xs shadow-md">LL</div>
                            Loan<span className="text-primary">Link</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Connecting dreams with reality. We provide fast, secure, and reliable loan services tailored to your needs.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="hover:text-primary transition-colors text-xl"><FaFacebook /></a>
                            <a href="#" className="hover:text-primary transition-colors text-xl"><FaTwitter /></a>
                            <a href="#" className="hover:text-primary transition-colors text-xl"><FaLinkedin /></a>
                            <a href="#" className="hover:text-red-500 transition-colors text-xl"><FaYoutube /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-primary hover:translate-x-1 inline-block transition-all">Home</Link></li>
                            <li><Link to="/all-loans" className="hover:text-primary hover:translate-x-1 inline-block transition-all">All Loans</Link></li>
                            <li><Link to="/dashboard/profile" className="hover:text-primary hover:translate-x-1 inline-block transition-all">My Dashboard</Link></li>
                            <li><Link to="/about" className="hover:text-primary hover:translate-x-1 inline-block transition-all">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Our Services</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a className="hover:text-primary transition-colors">Personal Loans</a></li>
                            <li><a className="hover:text-primary transition-colors">Business Capital</a></li>
                            <li><a className="hover:text-primary transition-colors">Education Funding</a></li>
                            <li><a className="hover:text-primary transition-colors">Home Improvement</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Stay Updated</h3>
                        <p className="text-sm text-gray-400 mb-3">Subscribe to get the latest loan offers.</p>
                        <div className="join w-full">
                            <input className="input input-bordered join-item w-full bg-gray-800 border-gray-700 text-white focus:outline-none" placeholder="Email address" />
                            <button className="btn btn-primary join-item rounded-r-full text-white">Subscribe</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
                    <p>&copy; {new Date().getFullYear()} LoanLink. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;