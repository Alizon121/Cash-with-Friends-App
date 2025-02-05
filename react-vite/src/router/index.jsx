import { createBrowserRouter } from 'react-router-dom';
import SignupFormPage from '../components/SignupFormPage';
import UserDashboardPage from '../components/UserDashboard';
import PaymentDuePage from '../components/PaymentDue';
import AmountOwedPage from '../components/AmountOwed';
import CommentDetailsPage from '../components/CommentDetails';
import AllCommentsPage from '../components/AllComments';
import FriendsPage from '../components/Friends';
import UserProfilePage from '../components/UserProfile/UserProfilePage';
import Layout from './Layout';

// This function is from the starter and is not relevant
// export const router = createBrowserRouter([
//   {
//     element: <Layout />,
//     children: [
//       {
//         path: "/",
//         element: <h1>Welcome!</h1>,
//       },
//       // We should change this to a modal
//       {
//         path: "login",
//         element: <LoginFormPage />,
//       },
//       {
//         path: "signup",
//         element: <SignupFormPage />,
//       },
//     ],
//   },
// ]);


// Maybe we could use this setup instead?
export const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <SignupFormPage/>
      },
      {
        path: "/users/dashboard",
        element: <UserDashboardPage/>
      },
      {
        path: "expenses/:id/payment_due",
        element: <PaymentDuePage/>
      },
      {
        path: "/expenses/:id/amount_owed",
        element: <AmountOwedPage/>
      },
      {
        path: "/expenses/:id/comments",
        element: <CommentDetailsPage/>
      },
      {
        path: "/comments",
        element: <AllCommentsPage/>
      },
      {
        path: "/friends",
        element: <FriendsPage/>
      },
      {
        path: "/users/profile",
        element: <UserProfilePage/>
      }
    ]
  }
])