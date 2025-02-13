import styles from "./UserProfile.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { thunkAuthenticate } from "../../redux/session";
import UpdateProfileModal from "../UpdateUserModal/UpdateProfileModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import OpenModalButton from "../OpenModalButton";

const UserProfilePage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);

    useEffect(() => {
        dispatch(thunkAuthenticate());
    }, [dispatch]);

    return (
        <div className={styles.userProfileContainer}>
            <div className={styles.profileSection}>
                <h2><strong>Profile</strong></h2>
                <div className={styles.profileContent}>
                    <div className={styles.profileDetails}>
                        <p><strong>First Name:</strong></p>
                        <p>{`${user?.first_name}`}</p>
                        <p><strong>Last Name:</strong></p>
                        <p>{user?.last_name}</p>
                        <p><strong>Username:</strong></p>
                        <p>{user?.username}</p>
                        <p><strong>Email:</strong></p>
                        <p>{user?.email}</p>
                    </div>
                    <div className={styles.profileAvatarSection}>
                        <FaUserCircle className={styles.profileIcon} />
                        <div className={styles.updateProfileButton}>
                            <OpenModalMenuItem
                                modalComponent={<UpdateProfileModal user={user} />}
                                itemText="Update Profile"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
