import { useEffect, useState } from "react";
import {  Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import FriendsList from "../components/Navigation/FriendsList";

export default function Layout() {
  const dispatch = useDispatch();
  const location = useLocation()
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
      dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation />
        {isLoaded && <Outlet />}
        {location.pathname !== "/" && <FriendsList/>}
        <Modal />
      </ModalProvider>
    </>
  );
}
