import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import FriendsList from "../components/Navigation/FriendsList";
import styles from "./Layout.module.css";  // Import the new CSS file

export default function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/") {
      dispatch(thunkAuthenticate());
    }
    setIsLoaded(true)
  }, [dispatch]);

  return (
    <ModalProvider>
      <Navigation />
      <div className={styles.layoutContainer}>
        {(location.pathname !== "/" && location.pathname !== "/friends") && (
          <div className={styles.sidebar}>
            <FriendsList />
          </div>
        )}
        <div className={styles.mainContent}>
          {isLoaded && <Outlet />}
        </div>
      </div>
      <Modal />
    </ModalProvider>
  );
}
