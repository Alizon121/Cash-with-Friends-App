import styles from "./UpdateProfileModal.module.css";
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
            closeModal();
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.header}>
                <h3 className={styles.title}>Update Profile</h3>
                <button onClick={closeModal} className={styles.close}>&times;</button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.section}>
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    className={styles.input}
                />
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    className={styles.input}
                />
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                    className={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className={styles.input}
                />

                <div className={styles.buttonContainer}>
                    <button type="button" onClick={closeModal} className={`${styles.button} ${styles.cancel}`}>
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className={`${styles.button} ${styles.update}`}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProfileModal;
