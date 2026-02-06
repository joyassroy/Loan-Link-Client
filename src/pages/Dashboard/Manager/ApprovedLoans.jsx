import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ApprovedLoans = () => {
    const axiosSecure = useAxiosSecure();

    const { data: applications = [] } = useQuery({
        queryKey: ['approved-applications'],
        queryFn: async () => {
            // Fetch only approved loans
            const res = await axiosSecure.get('/applications/approved'); // Need this endpoint
            return res.data;
        }
    });

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Approved Applications</h2>
            <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
                <table className="table">
                    <thead className="bg-success text-white">
                        <tr>
                            <th>#</th>
                            <th>Applicant</th>
                            <th>Loan Amount</th>
                            <th>Date Applied</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app, index) => (
                            <tr key={app._id}>
                                <th>{index + 1}</th>
                                <td>
                                    <div className="font-bold">{app.applicantName}</div>
                                    <div className="text-xs opacity-50">{app.email}</div>
                                </td>
                                <td>${app.loanAmount}</td>
                                <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                                <td className="font-bold text-success">Approved</td>
                            </tr>
                        ))}
                        {applications.length === 0 && <tr><td colSpan="5" className="text-center p-4">No approved loans yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovedLoans;