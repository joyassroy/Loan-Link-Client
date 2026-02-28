import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaDownload, FaChartLine, FaFileAlt } from "react-icons/fa";

const Reports = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch All Applications for the Report
    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['admin-reports'],
        queryFn: async () => {
            const res = await axiosSecure.get('/applications');
            return res.data;
        }
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-[70vh]"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    // Basic Analysis
    const totalApps = applications.length;
    const approvedApps = applications.filter(app => app.status === 'approved').length;
    const pendingApps = applications.filter(app => app.status === 'pending').length;
    const rejectedApps = applications.filter(app => app.status === 'rejected').length;

    // Fake Download Handler
    const handleDownload = () => {
        alert("Downloading PDF Report... (Demo Feature)");
    };

    return (
        <div className="text-base-content transition-colors duration-300">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-base-content flex items-center gap-3">
                        <FaChartLine className="text-primary" /> System Reports
                    </h1>
                    <p className="text-base-content/70 mt-2">
                        Analyze loan applications and system performance.
                    </p>
                </div>
                <button onClick={handleDownload} className="btn btn-primary rounded-xl gap-2 shadow-lg shadow-primary/30">
                    <FaDownload /> Export PDF
                </button>
            </div>

            {/* --- QUICK STATS --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 text-center">
                    <h4 className="text-base-content/60 text-sm font-bold uppercase tracking-wider">Total</h4>
                    <p className="text-3xl font-extrabold text-primary mt-2">{totalApps}</p>
                </div>
                <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 text-center">
                    <h4 className="text-base-content/60 text-sm font-bold uppercase tracking-wider">Approved</h4>
                    <p className="text-3xl font-extrabold text-success mt-2">{approvedApps}</p>
                </div>
                <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 text-center">
                    <h4 className="text-base-content/60 text-sm font-bold uppercase tracking-wider">Pending</h4>
                    <p className="text-3xl font-extrabold text-warning mt-2">{pendingApps}</p>
                </div>
                <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 text-center">
                    <h4 className="text-base-content/60 text-sm font-bold uppercase tracking-wider">Rejected</h4>
                    <p className="text-3xl font-extrabold text-error mt-2">{rejectedApps}</p>
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="bg-base-100 rounded-3xl shadow-sm border border-base-300 overflow-hidden">
                <div className="p-6 border-b border-base-300 bg-base-200/50 flex items-center gap-2">
                    <FaFileAlt className="text-base-content/50" />
                    <h3 className="text-lg font-bold text-base-content">Recent Activity Log</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className="bg-base-200/50 text-base-content/70">
                                <th>Date</th>
                                <th>Applicant</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.slice(0, 10).map((app, index) => (
                                <tr key={app._id || index} className="hover:bg-base-200 transition-colors">
                                    <td className="text-base-content/70 text-sm">
                                        {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td>
                                        <div className="font-bold">{app.firstName} {app.lastName}</div>
                                        <div className="text-xs text-base-content/50">{app.email}</div>
                                    </td>
                                    <td>
                                        <span className="badge badge-ghost badge-sm font-medium">{app.loanCategory}</span>
                                    </td>
                                    <td className="font-bold text-base-content">${app.loanAmount}</td>
                                    <td>
                                        <span className={`badge badge-sm font-bold uppercase tracking-wider ${
                                            app.status === 'approved' ? 'badge-success text-white' : 
                                            app.status === 'rejected' ? 'badge-error text-white' : 'badge-warning'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {applications.length === 0 && (
                        <div className="p-8 text-center text-base-content/50">No application data found.</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Reports;