import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const AdminAllLoans = () => {
    const axiosSecure = useAxiosSecure();

    const { data: loans = [], refetch } = useQuery({
        queryKey: ['admin-loans'],
        queryFn: async () => {
            const res = await axiosSecure.get('/loans');
            return res.data;
        }
    });

    // Toggle "Show on Home" status
    const handleToggleHome = async (loan, currentStatus) => {
        const newStatus = !currentStatus; // Flip the boolean
        
        try {
            // We need a specific endpoint for this patch
            const res = await axiosSecure.patch(`/loans/featured/${loan._id}`, { showOnHome: newStatus });
            if (res.data.modifiedCount > 0) {
                toast.success(newStatus ? "Added to Home Page" : "Removed from Home Page");
                refetch();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/loans/${id}`);
                if (res.data.deletedCount > 0) {
                    refetch();
                    Swal.fire("Deleted!", "Loan has been deleted.", "success");
                }
            }
        });
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage All Loans (Admin)</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Show on Home</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan, index) => (
                            <tr key={loan._id}>
                                <th>{index + 1}</th>
                                <td>{loan.title}</td>
                                <td>{loan.category}</td>
                                <td>
                                    {/* Toggle Switch */}
                                    <input 
                                        type="checkbox" 
                                        className="toggle toggle-success" 
                                        checked={loan.showOnHome || false}
                                        onChange={() => handleToggleHome(loan, loan.showOnHome)} 
                                    />
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(loan._id)} className="btn btn-error btn-xs text-white">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAllLoans;