import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkAuthenticate, thunkLogout } from "../../redux/session";
import UpdateProfileModal from "../UpdateUserModal/UpdateProfileModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

const UserProfilePage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);

    useEffect(() => {
        dispatch(thunkAuthenticate()); 
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(thunkLogout());
    };

    return (
        <div className="user-profile-container">
            <h1>Cash with Friends</h1>
            <div className="user-info">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
                <span className="username-display">👤 {user?.username}</span>
            </div>

            <div className="profile-section">
                <h2><strong>Profile</strong></h2>
                <div className="profile-content">
                    <div className="profile-avatar-section">
                        <img 
                            src={user?.avatar || "/default-avatar.png"} 
                            alt="Profile Avatar" 
                            className="profile-avatar" 
                        />
                    </div>
                    <div className="profile-details">
                        <p><strong>First Name:</strong> {user?.first_name}</p>
                        <p><strong>Last Name:</strong> {user?.last_name}</p>
                        <p><strong>Username:</strong> {user?.username}</p>
                        <p><strong>Email:</strong> {user?.email}</p>

                        <button>{/* ✅ Corrected Button for Opening Modal */}
                        <OpenModalMenuItem
                            modalComponent={<UpdateProfileModal user={user} />}
                            itemtext="Update Profile"
                        /> Update Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;