import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // Manager actions are private
import Swal from "sweetalert2";

const ManageLoans = () => {
    const axiosSecure = useAxiosSecure();

    // Use /loans endpoint. NOTE: In a real app, you might filter by 'manager email' if needed
    // But for this assignment, managers can usually see all loans to manage them.
    const { data: loans = [], refetch } = useQuery({
        queryKey: ['manage-loans'],
        queryFn: async () => {
            const res = await axiosSecure.get('/loans'); 
            return res.data;
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/loans/${id}`);
                if (res.data.deletedCount > 0) {
                    refetch();
                    Swal.fire("Deleted!", "Your loan has been deleted.", "success");
                }
            }
        });
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage Loans</h2>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Max Limit</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan, index) => (
                            <tr key={loan._id}>
                                <th>{index + 1}</th>
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img src={loan.image} alt="Loan" />
                                        </div>
                                    </div>
                                </td>
                                <td>{loan.title}</td>
                                <td>{loan.category}</td>
                                <td>${loan.maxLimit}</td>
                                <td>
                                    <button onClick={() => handleDelete(loan._id)} className="btn btn-ghost btn-xs text-red-600">
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

export default ManageLoans;