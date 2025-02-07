import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkUpdateUser } from "../../redux/session";
import { useModal } from "../../context/Modal";

const UpdateProfileModal = ({ user }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [formData, setFormData] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const errors = await dispatch(thunkUpdateUser(formData));

        if (errors) {
            setError(errors.server || "Failed to update profile.");
            setIsSubmitting(false);
        } else {
            console.log("✅ Profile updated successfully! Closing modal.");
            closeModal();  // ✅ This will now work because `OpenModalMenuItem` provides it
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Update Profile</h3>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required />
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required />
                    <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>

                    <button type="button" onClick={closeModal} className="cancel-button">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfileModal;