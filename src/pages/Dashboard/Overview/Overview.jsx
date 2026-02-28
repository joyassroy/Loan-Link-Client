import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaUsers, FaMoneyBillWave, FaFileInvoiceDollar, FaCheckCircle, FaWallet } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Overview = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    // 1. Fetch User Role
    const { data: userRole = 'borrower', isLoading: roleLoading } = useQuery({
        queryKey: ['role', user?.email],
        enabled: !!user?.email && !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data?.role;
        }
    });

    const role = userRole?.toLowerCase() || 'borrower';
    const isAdminOrManager = role === 'admin' || role === 'manager';

    // 2. Fetch REAL Dashboard Stats (Dynamic Data from Backend)
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboard-stats', role, user?.email],
        enabled: !!role && !roleLoading && !!user?.email,
        queryFn: async () => {
            
            if (isAdminOrManager) {
                // ✅ ADMIN / MANAGER DATA
                try {
                    const appsRes = await axiosSecure.get(`/applications`);
                    const loansRes = await axiosSecure.get(`/loans`);
                    
                    let usersData = [];
                    if (role === 'admin') {
                        try {
                            const usersRes = await axiosSecure.get('/users');
                            usersData = usersRes.data || [];
                        } catch (err) {
                            console.error("Could not fetch users", err);
                        }
                    }

                    const allApps = appsRes.data || [];
                    const allLoans = loansRes.data || [];

                    const totalApplications = allApps.length;
                    const totalLoans = allLoans.length;
                    const totalUsers = usersData.length; 
                    
                    const paidAppsCount = allApps.filter(app => app.paymentStatus === 'paid').length;
                    const totalRevenue = paidAppsCount * 10;

                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const monthlyData = {};

                    allApps.forEach(app => {
                        const date = new Date(app.appliedDate);
                        const month = monthNames[date.getMonth()];
                        
                        if (!monthlyData[month]) {
                            monthlyData[month] = { name: month, loans: 0, amount: 0 };
                        }
                        
                        monthlyData[month].loans += 1;
                        monthlyData[month].amount += Number(app.loanAmount) || 0;
                    });

                    let chartData = Object.values(monthlyData);
                    
                    if (chartData.length === 0) {
                        chartData = [{ name: 'No Data', loans: 0, amount: 0 }];
                    }

                    return {
                        totalApplications,
                        totalLoans,
                        totalUsers: role === 'admin' ? totalUsers : "N/A", 
                        totalRevenue,
                        chartData
                    };

                } catch (error) {
                    console.error("Admin Stats Error:", error);
                    return { totalApplications: 0, totalLoans: 0, totalUsers: 0, totalRevenue: 0, chartData: [{ name: 'Error', loans: 0, amount: 0 }] };
                }

            } else {
                // ✅ BORROWER DATA
                try {
                    const res = await axiosSecure.get(`/applications?email=${user.email}`);
                    const myApps = res.data || []; 
                    
                    const totalApps = myApps.length;
                    const approvedLoans = myApps.filter(app => app.status === 'approved').length;
                    const paidFeesCount = myApps.filter(app => app.paymentStatus === 'paid').length;
                    const totalPaidFees = paidFeesCount * 10;

                    let chartData = myApps.map((app, index) => ({
                        name: `${app.loanCategory || 'App'} #${index + 1}`,
                        amount: Number(app.loanAmount) || 0 
                    }));

                    if (chartData.length === 0) {
                         chartData = [{ name: 'No Data', amount: 0 }];
                    }

                    return {
                        myTotalApplications: totalApps,
                        myApprovedLoans: approvedLoans,
                        totalPaidFees: totalPaidFees,
                        chartData: chartData
                    };
                } catch (error) {
                    console.error("User Stats Error:", error);
                    return { myTotalApplications: 0, myApprovedLoans: 0, totalPaidFees: 0, chartData: [{ name: 'Error', amount: 0 }] };
                }
            }
        }
    });

    if (loading || roleLoading || statsLoading) {
        return <div className="flex justify-center items-center h-[70vh]"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    const safeStats = stats || {};

    return (
        <div className="text-base-content transition-colors duration-300 pb-10">
            
            {/* --- HEADER --- */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-base-content">
                    Welcome back, <span className="text-primary">{user?.displayName?.split(' ')[0]}</span>! 👋
                </h1>
                <p className="text-base-content/70 mt-2">
                    {isAdminOrManager ? "Here is the overall system performance." : "Here is your real-time loan application activity."}
                    <span className="badge badge-primary ml-2 uppercase text-xs font-bold tracking-wider border-none shadow-sm">{role}</span>
                </p>
            </div>

            {/* --- BORROWER OVERVIEW CARDS --- */}
            {!isAdminOrManager && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-base-100 p-6 rounded-3xl shadow-lg shadow-base-300/50 border border-base-200 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                        <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl shadow-md"><FaFileInvoiceDollar size={28} /></div>
                        <div>
                            <p className="text-sm font-bold text-base-content/50 uppercase tracking-wider">Total Applications</p>
                            <h3 className="text-3xl font-extrabold text-base-content mt-1">{safeStats.myTotalApplications || 0}</h3>
                        </div>
                    </div>
                    <div className="bg-base-100 p-6 rounded-3xl shadow-lg shadow-base-300/50 border border-base-200 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                        <div className="p-4 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl shadow-md"><FaCheckCircle size={28} /></div>
                        <div>
                            <p className="text-sm font-bold text-base-content/50 uppercase tracking-wider">Approved Loans</p>
                            <h3 className="text-3xl font-extrabold text-base-content mt-1">{safeStats.myApprovedLoans || 0}</h3>
                        </div>
                    </div>
                    <div className="bg-base-100 p-6 rounded-3xl shadow-lg shadow-base-300/50 border border-base-200 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                        <div className="p-4 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-2xl shadow-md"><FaWallet size={28} /></div>
                        <div>
                            <p className="text-sm font-bold text-base-content/50 uppercase tracking-wider">Total Fees Paid</p>
                            <h3 className="text-3xl font-extrabold text-base-content mt-1">${safeStats.totalPaidFees || 0}</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ADMIN / MANAGER OVERVIEW CARDS --- */}
            {isAdminOrManager && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-base-100 p-6 rounded-3xl shadow-lg shadow-base-300/50 border border-base-200 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                        <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl shadow-md"><FaUsers size={28} /></div>
                        <div>
                            <p className="text-sm font-bold text-base-content/50 uppercase tracking-wider">Total Users</p>
                            <h3 className="text-3xl font-extrabold text-base-content mt-1">{safeStats.totalUsers || 0}</h3>
                        </div>
                    </div>
                    <div className="bg-base-100 p-6 rounded-3xl shadow-lg shadow-base-300/50 border border-base-200 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                        <div className="p-4 bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl shadow-md"><FaMoneyBillWave size={28} /></div>
                        <div>
                            <p className="text-sm font-bold text-base-content/50 uppercase tracking-wider">Total Loans</p>
                            <h3 className="text-3xl font-extrabold text-base-content mt-1">{safeStats.totalLoans || 0}</h3>
                        </div>
                    </div>
                    <div className="bg-base-100 p-6 rounded-3xl shadow-lg shadow-base-300/50 border border-base-200 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                        <div className="p-4 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-2xl shadow-md"><FaFileInvoiceDollar size={28} /></div>
                        <div>
                            <p className="text-sm font-bold text-base-content/50 uppercase tracking-wider">Applications</p>
                            <h3 className="text-3xl font-extrabold text-base-content mt-1">{safeStats.totalApplications || 0}</h3>
                        </div>
                    </div>
                    <div className="bg-base-100 p-6 rounded-3xl shadow-lg shadow-base-300/50 border border-base-200 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                        <div className="p-4 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl shadow-md"><FaWallet size={28} /></div>
                        <div>
                            <p className="text-sm font-bold text-base-content/50 uppercase tracking-wider">Revenue</p>
                            <h3 className="text-3xl font-extrabold text-base-content mt-1">${safeStats.totalRevenue || 0}</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 🚀 BEAUTIFUL DUAL Y-AXIS RECHARTS SECTION --- */}
            <div className="bg-base-100 p-6 md:p-8 rounded-3xl shadow-lg shadow-base-300/50 border border-base-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h3 className="text-xl md:text-2xl font-extrabold text-base-content">
                            {isAdminOrManager ? "Monthly Financial Analytics" : "Your Loan Insights"}
                        </h3>
                        <p className="text-base-content/60 text-sm mt-1">
                            {isAdminOrManager ? "Comparing Revenue ($) vs Application Count" : "Data represented in USD ($)"}
                        </p>
                    </div>
                </div>
                
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={safeStats.chartData || []}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                            barSize={30} // 🔹 width ektu komiyechi jeno 2ta bar pasapasi boste pare
                        >
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={1}/>
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.2}/>
                                </linearGradient>
                                <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={1}/>
                                    <stop offset="95%" stopColor="#67e8f9" stopOpacity={0.2}/>
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                            
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                stroke="currentColor" 
                                opacity={0.6} 
                                dy={10} 
                                tick={{ fontSize: 13, fontWeight: 500 }}
                            />
                            
                            {/* 🔹 Left Y-Axis (For Amount $) */}
                            <YAxis 
                                yAxisId="left"
                                orientation="left"
                                axisLine={false} 
                                tickLine={false} 
                                stroke="currentColor" 
                                opacity={0.6} 
                                dx={-10}
                                tick={{ fontSize: 13, fontWeight: 500 }}
                            />
                            
                            {/* 🔹 Right Y-Axis (For Number of Applications) */}
                            {isAdminOrManager && (
                                <YAxis 
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false} 
                                    tickLine={false} 
                                    stroke="currentColor" 
                                    opacity={0.6} 
                                    dx={10}
                                    tick={{ fontSize: 13, fontWeight: 500 }}
                                />
                            )}
                            
                            {/* ✅ FIX: cursor={false} gray background sorabe, shared={true} 2ta bar er result aksathe dekhabe */}
                            <Tooltip 
                                cursor={false} 
                                shared={true}
                                contentStyle={{ 
                                    backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))', 
                                    borderColor: 'var(--fallback-b3,oklch(var(--b3)))', 
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ color: 'var(--fallback-bc,oklch(var(--bc)))', fontWeight: 'bold' }}
                            />
                            
                            {isAdminOrManager && <Legend wrapperStyle={{ paddingTop: '20px' }} />}
                            
                            <Bar 
                                yAxisId="left"
                                dataKey="amount" 
                                fill="url(#colorAmount)" 
                                radius={[6, 6, 0, 0]} 
                                name="Requested Amount ($)" 
                                animationDuration={1500}
                                animationEasing="ease-out"
                            />
                            {isAdminOrManager && (
                                <Bar 
                                    yAxisId="right"
                                    dataKey="loans" 
                                    fill="url(#colorLoans)" 
                                    radius={[6, 6, 0, 0]} 
                                    name="No. of Applications" 
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default Overview;