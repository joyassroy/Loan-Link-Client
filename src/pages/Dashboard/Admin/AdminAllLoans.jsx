import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaUsers, FaDollarSign, FaFileInvoiceDollar, FaChartPie } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const AdminAllLoans= () => {
    const axiosSecure = useAxiosSecure();

    // 1. Sob Applications Fetch koro (Backend theke)
    const { data: applications = [] } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/applications'); // Admin shob application pay
            return res.data;
        }
    });

    // 2. Sob Users Fetch koro
    const { data: users = [] } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    // --- FRONTEND CALCULATIONS (Backend chara) ---

    // A. Total Amount Calculation
    const totalLoanAmount = applications.reduce((sum, item) => sum + parseInt(item.loanAmount || 0), 0);

    // B. Pie Chart Data (Status wise)
    const statusData = [
        { name: 'Pending', value: applications.filter(app => app.status === 'pending').length, color: '#FFBB28' },
        { name: 'Approved', value: applications.filter(app => app.status === 'approved').length, color: '#00C49F' },
        { name: 'Rejected', value: applications.filter(app => app.status === 'rejected').length, color: '#FF8042' },
    ];

    // C. Bar Chart Data (Category wise)
    const categoryCounts = {};
    applications.forEach(app => {
        const cat = app.loanCategory || "Others";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    // Chart er format e convert kora
    const barChartData = Object.keys(categoryCounts).map(key => ({
        name: key,
        count: categoryCounts[key]
    }));

    // Recharts Dynamic Colors for Dark/Light Mode compatibility
    const axisColor = "var(--fallback-bc, oklch(var(--bc) / 0.5))";
    const gridColor = "var(--fallback-b3, oklch(var(--b3) / 0.2))";
    const tooltipBg = "var(--fallback-b1, oklch(var(--b1)))";
    const tooltipColor = "var(--fallback-bc, oklch(var(--bc)))";

    return (
        <div className="p-6 bg-base-200 min-h-screen font-sans transition-colors duration-300 pb-20">
            <h2 className="text-3xl font-extrabold text-base-content mb-6">Dashboard Overview</h2>

            {/* --- 1. SUMMARY CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                
                {/* Total Users */}
                <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 flex items-center gap-4 transition-colors">
                    <div className="p-4 bg-info/20 text-info rounded-full text-2xl"><FaUsers /></div>
                    <div>
                        <p className="text-base-content/60 font-bold text-xs uppercase">Total Users</p>
                        <h3 className="text-3xl font-extrabold text-base-content">{users.length}</h3>
                    </div>
                </div>

                {/* Total Applications */}
                <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 flex items-center gap-4 transition-colors">
                    <div className="p-4 bg-primary/20 text-primary rounded-full text-2xl"><FaFileInvoiceDollar /></div>
                    <div>
                        <p className="text-base-content/60 font-bold text-xs uppercase">Total Applications</p>
                        <h3 className="text-3xl font-extrabold text-base-content">{applications.length}</h3>
                    </div>
                </div>

                {/* Total Disbursed Amount */}
                <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 flex items-center gap-4 transition-colors">
                    <div className="p-4 bg-success/20 text-success rounded-full text-2xl"><FaDollarSign /></div>
                    <div>
                        <p className="text-base-content/60 font-bold text-xs uppercase">Total Requested</p>
                        <h3 className="text-3xl font-extrabold text-base-content">${totalLoanAmount.toLocaleString()}</h3>
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 flex items-center gap-4 transition-colors">
                    <div className="p-4 bg-warning/20 text-warning rounded-full text-2xl"><FaChartPie /></div>
                    <div>
                        <p className="text-base-content/60 font-bold text-xs uppercase">Pending Requests</p>
                        <h3 className="text-3xl font-extrabold text-base-content">
                            {applications.filter(a => a.status === 'pending').length}
                        </h3>
                    </div>
                </div>
            </div>

            {/* --- 2. CHARTS SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Bar Chart: Loan Categories */}
                <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300 transition-colors">
                    <h3 className="text-xl font-bold text-base-content mb-6">Popular Loan Categories</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                <XAxis dataKey="name" tick={{fontSize: 12, fill: axisColor}} stroke={axisColor} />
                                <YAxis tick={{fill: axisColor}} stroke={axisColor} />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: tooltipBg, 
                                        color: tooltipColor, 
                                        borderRadius: '10px', 
                                        borderColor: gridColor, 
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }} 
                                    itemStyle={{color: tooltipColor}}
                                    cursor={{fill: gridColor}}
                                />
                                <Bar dataKey="count" fill="#4F46E5" radius={[10, 10, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Application Status */}
                <div className="bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300 transition-colors">
                    <h3 className="text-xl font-bold text-base-content mb-6">Application Status</h3>
                    <div className="h-80 w-full flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: tooltipBg, 
                                        color: tooltipColor, 
                                        borderRadius: '10px', 
                                        borderColor: gridColor,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}
                                    itemStyle={{color: tooltipColor}}
                                />
                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{color: axisColor, fontWeight: 'bold'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminAllLoans;