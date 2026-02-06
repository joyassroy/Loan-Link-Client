import { FaCode, FaGithub, FaLinkedin, FaEnvelope, FaRocket, FaHandshake, FaLightbulb, FaShieldAlt } from "react-icons/fa";

const About = () => {
    return (
        <div className="font-sans bg-gray-50 text-gray-800">

            {/* --- 1. HERO HEADER --- */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-24 text-center text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
                <div className="relative z-10 container mx-auto px-6">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4 animate-fade-in-up">
                        We Are <span className="text-yellow-300">LoanLink</span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
                        Bridging the gap between dreams and reality through seamless financial solutions.
                    </p>
                </div>
            </div>

            {/* --- 2. OUR MISSION & VISION --- */}
            <div className="container mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Image Side */}
                    <div className="md:w-1/2 relative">
                        <div className="absolute top-4 -left-4 w-full h-full bg-blue-100 rounded-3xl -z-10"></div>
                        <img 
                            src="https://img.freepik.com/free-vector/business-team-brainstorming-discussing-startup-project_74855-6909.jpg" 
                            alt="Our Team" 
                            className="rounded-3xl shadow-2xl w-full object-cover border-4 border-white"
                        />
                    </div>
                    {/* Text Side */}
                    <div className="md:w-1/2 space-y-6">
                        <div className="badge badge-primary badge-outline font-bold p-3 uppercase tracking-widest">Our Story</div>
                        <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                            Building a Future Without <br/> Financial Barriers.
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            LoanLink started with a simple idea: getting a loan shouldn't be complicated. We believe everyone deserves a chance to grow their business, pursue education, or build a home without drowning in paperwork.
                        </p>
                        <div className="grid grid-cols-2 gap-6 mt-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-100 text-green-600 rounded-full"><FaRocket /></div>
                                <span className="font-bold text-gray-700">Fast Approval</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><FaShieldAlt /></div>
                                <span className="font-bold text-gray-700">Secure Data</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><FaLightbulb /></div>
                                <span className="font-bold text-gray-700">Smart Solutions</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><FaHandshake /></div>
                                <span className="font-bold text-gray-700">Trusted Partners</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 3. MEET THE DEVELOPER (Highlight Section) --- */}
            <div className="bg-white py-24 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="inline-block mb-10">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 font-extrabold text-sm uppercase tracking-widest">
                            Behind the Code
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2">Meet the Mastermind</h2>
                    </div>

                    {/* Developer Card */}
                    <div className="max-w-4xl mx-auto bg-base-100 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-blue-100/50 transition-shadow duration-500">
                        <div className="flex flex-col md:flex-row">
                            
                            {/* Profile Image Section */}
                            <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-600 flex flex-col items-center justify-center p-10 text-white relative">
                                <div className="w-40 h-40 rounded-full border-4 border-white/30 shadow-xl overflow-hidden mb-6">
                                    {/* এখানে তোমার ছবি বসাতে পারো */}
                                    <img 
                                        src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg" 
                                        alt="Joyassroy Barua" 
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold">Joyassroy Barua</h3>
                                <p className="text-blue-200 font-medium">Full Stack Developer</p>
                                <div className="mt-6 flex gap-4">
                                    <a href="#" className="btn btn-circle btn-sm btn-ghost bg-white/20 text-white hover:bg-white hover:text-blue-600 border-none"><FaGithub size={18} /></a>
                                    <a href="#" className="btn btn-circle btn-sm btn-ghost bg-white/20 text-white hover:bg-white hover:text-blue-600 border-none"><FaLinkedin size={18} /></a>
                                    <a href="#" className="btn btn-circle btn-sm btn-ghost bg-white/20 text-white hover:bg-white hover:text-blue-600 border-none"><FaEnvelope size={18} /></a>
                                </div>
                            </div>

                            {/* Bio / Details Section */}
                            <div className="md:w-3/5 p-10 text-left flex flex-col justify-center">
                                <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
                                    <FaCode /> <span>Developer Story</span>
                                </div>
                                <h4 className="text-2xl font-bold text-gray-800 mb-4">
                                    Crafting Digital Experiences with Passion
                                </h4>
                                <p className="text-gray-500 leading-relaxed mb-6">
                                    Hi! I'm <span className="font-bold text-gray-800">Joyassroy Barua</span>. 
                                    I built LoanLink with a vision to make financial services accessible to everyone through modern technology. 
                                    Specializing in the MERN Stack, I love turning complex problems into simple, beautiful, and user-friendly web applications.
                                </p>
                                
                                {/* Skill Tags */}
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tech Stack</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="badge badge-lg bg-gray-100 text-gray-600 border-none font-semibold">React.js</span>
                                        <span className="badge badge-lg bg-gray-100 text-gray-600 border-none font-semibold">Node.js</span>
                                        <span className="badge badge-lg bg-gray-100 text-gray-600 border-none font-semibold">MongoDB</span>
                                        <span className="badge badge-lg bg-gray-100 text-gray-600 border-none font-semibold">Tailwind</span>
                                        <span className="badge badge-lg bg-gray-100 text-gray-600 border-none font-semibold">Stripe</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* --- 4. CTA FOOTER --- */}
            <div className="bg-gray-900 py-16 text-center text-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">Join us today and experience the future of loan management.</p>
                    <button className="btn btn-primary btn-lg rounded-full px-10 shadow-lg hover:scale-105 transition-transform">
                        Contact Us
                    </button>
                </div>
            </div>

        </div>
    );
};

export default About;