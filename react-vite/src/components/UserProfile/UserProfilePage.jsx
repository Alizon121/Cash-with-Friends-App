import styles from "./UserProfile.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { thunkAuthenticate } from "../../redux/session";
import UpdateProfileModal from "../UpdateUserModal/UpdateProfileModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import OpenModalButton from "../OpenModalButton";
import "./UserProfile.module.css"

const UserProfilePage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);

    useEffect(() => {
        dispatch(thunkAuthenticate());
    }, [dispatch]);

    return (
        <div className={styles.userProfileContainer}>
            <div className={styles.profileSection}>
                <h2><strong>View Your Profile</strong></h2>
                <div className={styles.divider}></div>
                <div className={styles.profileContent}>
                    <div className={styles.profileDetails}>
                        <div className={styles.profile_content_container}>
                            <p className={styles.profile_content_subheaders}><strong>First Name:</strong></p>
                            <p className={styles.profile_content_data}>{`${user?.first_name}`}</p>
                        </div>
                        <div className={styles.profile_content_container}>
                            <p className={styles.profile_content_subheaders}><strong>Last Name:</strong></p>
                            <p className={styles.profile_content_data}>{user?.last_name}</p>
                        </div>
                        <div className={styles.profile_content_container}>
                            <p className={styles.profile_content_subheaders}><strong>Username:</strong></p>
                            <p className={styles.profile_content_data}>{user?.username}</p>
                        </div>
                        <div className={styles.profile_content_container}>
                            <p className={styles.profile_content_subheaders}><strong>Email:</strong></p>
                            <p className={styles.profile_content_data}>{user?.email}</p>
                        </div>
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
