import { FaCode, FaGithub, FaLinkedin, FaEnvelope, FaRocket, FaHandshake, FaLightbulb, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const About = () => {
    // Animation Variants for reusability
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const fadeInLeft = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="font-sans bg-base-200 text-base-content transition-colors duration-300 overflow-hidden">

            {/* --- 1. HERO HEADER --- */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="relative bg-gradient-to-br from-primary via-indigo-700 to-secondary py-32 text-center text-white overflow-hidden"
            >
                {/* Animated Background Circles */}
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }} 
                    transition={{ repeat: Infinity, duration: 8 }}
                    className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                />
                
                <div className="relative z-10 container mx-auto px-6">
                    <motion.h1 
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-6xl md:text-8xl font-[1000] uppercase tracking-tighter mb-6 italic"
                    >
                        We Are <span className="text-yellow-400">Loan<span className="text-white">Link</span></span>
                    </motion.h1>
                    <motion.p 
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-medium italic opacity-80"
                    >
                        Bridging the gap between dreams and reality through seamless financial solutions.
                    </motion.p>
                </div>
            </motion.div>

            {/* --- 2. OUR MISSION & VISION --- */}
            <div className="container mx-auto px-6 py-32">
                <div className="flex flex-col md:flex-row items-center gap-20">
                    {/* Image Side */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInLeft}
                        className="md:w-1/2 relative group"
                    >
                        <div className="absolute top-6 -left-6 w-full h-full bg-primary/10 rounded-[3rem] -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
                        <img 
                            src="https://img.freepik.com/free-vector/business-team-brainstorming-discussing-startup-project_74855-6909.jpg" 
                            alt="Our Team" 
                            className="rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] w-full object-cover border-8 border-base-100 transform group-hover:scale-[1.02] transition-transform duration-700"
                        />
                    </motion.div>

                    {/* Text Side */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInRight}
                        className="md:w-1/2 space-y-8"
                    >
                        <div className="inline-block px-6 py-2 rounded-full bg-primary/10 text-primary font-black uppercase tracking-[0.3em] text-xs">Our Story</div>
                        <h2 className="text-5xl md:text-6xl font-[1000] text-base-content leading-[0.9] uppercase tracking-tighter italic">
                            Building a Future Without <br/> <span className="text-primary">Financial Barriers.</span>
                        </h2>
                        <p className="text-base-content/70 text-lg leading-relaxed font-medium italic">
                            LoanLink started with a simple idea: getting a loan shouldn't be complicated. We believe everyone deserves a chance to grow their business, pursue education, or build a home without drowning in paperwork.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-8 mt-10">
                            {[
                                { icon: <FaRocket />, label: "Fast Approval", color: "text-blue-500", bg: "bg-blue-500/10" },
                                { icon: <FaShieldAlt />, label: "Secure Data", color: "text-purple-500", bg: "bg-purple-500/10" },
                                { icon: <FaLightbulb />, label: "Smart Tech", color: "text-orange-500", bg: "bg-orange-500/10" },
                                { icon: <FaHandshake />, label: "Trusted", color: "text-green-500", bg: "bg-green-500/10" }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ x: 10 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-base-100 shadow-sm border border-base-content/5"
                                >
                                    <div className={`p-4 ${item.bg} ${item.color} rounded-2xl text-xl`}>{item.icon}</div>
                                    <span className="font-black uppercase tracking-tighter text-sm italic">{item.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- 3. MEET THE DEVELOPER --- */}
            <div className="bg-base-100 py-32 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-20"
                    >
                        <span className="text-primary font-black uppercase tracking-[0.5em] text-xs">Behind the Code</span>
                        <h2 className="text-6xl md:text-7xl font-[1000] text-base-content mt-4 uppercase tracking-tighter italic">Meet the <span className="text-primary underline underline-offset-8 text-secondary">Mastermind</span></h2>
                    </motion.div>

                    {/* Developer Card */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="max-w-5xl mx-auto bg-base-100 rounded-[4rem] shadow-2xl overflow-hidden border border-base-content/5 group"
                    >
                        <div className="flex flex-col md:flex-row">
                            
                            {/* Profile Image Section */}
                            <div className="md:w-2/5 bg-neutral p-16 text-white flex flex-col items-center justify-center relative overflow-hidden">
                                <motion.div 
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-56 h-56 rounded-[3rem] border-4 border-primary shadow-2xl overflow-hidden mb-8 relative z-10"
                                >
                                    <img 
                                        src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg" 
                                        alt="Joyassroy Barua" 
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                                <h3 className="text-3xl font-[1000] uppercase tracking-tighter italic">Joyassroy Barua</h3>
                                <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mt-2 italic">Full Stack Developer</p>
                                
                                <div className="mt-8 flex gap-4 relative z-10">
                                    {[FaGithub, FaLinkedin, FaEnvelope].map((Icon, i) => (
                                        <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300">
                                            <Icon size={20} />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Bio / Details Section */}
                            <div className="md:w-3/5 p-16 text-left flex flex-col justify-center bg-base-100">
                                <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-6">
                                    <FaCode className="text-xl" /> <span>Developer Log</span>
                                </div>
                                <h4 className="text-4xl font-[1000] text-base-content mb-6 uppercase tracking-tighter leading-none italic">
                                    Crafting Digital Experiences <br/> with <span className="text-primary underline">Passion</span>
                                </h4>
                                <p className="text-base-content/60 text-lg font-medium leading-relaxed italic mb-10">
                                    Hi! I'm <span className="font-extrabold text-base-content">Joyassroy Barua</span>. 
                                    I built LoanLink with a vision to make financial services accessible to everyone through modern technology. 
                                    Specializing in the MERN Stack, I love turning complex problems into simple, beautiful, and user-friendly web applications.
                                </p>
                                
                                {/* Skill Tags */}
                                <div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Tech Infrastructure</p>
                                    <div className="flex flex-wrap gap-3">
                                        {["React.js", "Node.js", "MongoDB", "Tailwind", "Stripe"].map((skill, i) => (
                                            <span key={i} className="px-5 py-2 rounded-xl bg-base-200 text-xs font-black uppercase italic tracking-wider border border-base-content/5 hover:border-primary transition-colors cursor-default">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- 4. CTA FOOTER --- */}
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-neutral py-24 text-center text-neutral-content transition-colors duration-300 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-5xl md:text-7xl font-[1000] uppercase tracking-tighter italic mb-6 leading-none">Ready to start <br/> your <span className="text-primary">journey?</span></h2>
                    <p className="text-lg font-medium opacity-50 mb-12 max-w-2xl mx-auto italic uppercase tracking-widest">Join us today and experience the future of loan management.</p>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary btn-lg rounded-[2rem] px-16 h-20 shadow-2xl font-[1000] uppercase italic tracking-[0.2em] border-none"
                    >
                        Contact Nodes
                    </motion.button>
                </div>
            </motion.div>

        </div>
    );
};

export default About;