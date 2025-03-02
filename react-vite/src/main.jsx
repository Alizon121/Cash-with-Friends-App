import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import configureStore from "./redux/store";
import { router } from "./router/index";
import * as sessionActions from "./redux/session";
import * as friendActions from "./redux/friends";
import * as commentActions from "./redux/comment";
import * as expenseActions from "./redux/expense";
import * as userActions from "./redux/users";
import "./index.css";

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
  window.friendActions = friendActions;
  window.commentActions = commentActions;
  window.expenseActions = expenseActions;
  window.userActions = userActions;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  </React.StrictMode>
);
