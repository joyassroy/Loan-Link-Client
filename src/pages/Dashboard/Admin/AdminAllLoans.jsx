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
    // Eita ektu tricky, amra category gulo count korbo
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Dashboard Overview</h2>

            {/* --- 1. SUMMARY CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                
                {/* Total Users */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-full text-2xl"><FaUsers /></div>
                    <div>
                        <p className="text-gray-500 font-bold text-xs uppercase">Total Users</p>
                        <h3 className="text-3xl font-extrabold text-gray-800">{users.length}</h3>
                    </div>
                </div>

                {/* Total Applications */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-full text-2xl"><FaFileInvoiceDollar /></div>
                    <div>
                        <p className="text-gray-500 font-bold text-xs uppercase">Total Applications</p>
                        <h3 className="text-3xl font-extrabold text-gray-800">{applications.length}</h3>
                    </div>
                </div>

                {/* Total Disbursed Amount */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-green-100 text-green-600 rounded-full text-2xl"><FaDollarSign /></div>
                    <div>
                        <p className="text-gray-500 font-bold text-xs uppercase">Total Requested</p>
                        <h3 className="text-3xl font-extrabold text-gray-800">${totalLoanAmount.toLocaleString()}</h3>
                    </div>
                </div>

                {/* Approval Rate (Optional Math) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-orange-100 text-orange-600 rounded-full text-2xl"><FaChartPie /></div>
                    <div>
                        <p className="text-gray-500 font-bold text-xs uppercase">Pending Requests</p>
                        <h3 className="text-3xl font-extrabold text-gray-800">
                            {applications.filter(a => a.status === 'pending').length}
                        </h3>
                    </div>
                </div>
            </div>

            {/* --- 2. CHARTS SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Bar Chart: Loan Categories */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-700 mb-6">Popular Loan Categories</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 12}} />
                                <YAxis />
                                <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="count" fill="#4F46E5" radius={[10, 10, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Application Status */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-700 mb-6">Application Status</h3>
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
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminAllLoans;