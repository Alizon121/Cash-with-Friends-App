import { createBrowserRouter } from 'react-router-dom';
import SignupFormPage from '../components/SignupFormPage';
import UserDashboardPage from '../components/UserDashboard';
import PaymentDuePage from '../components/PaymentDue';
import AmountOwedPage from '../components/AmountOwed';
import ExpenseCommentPage from '../components/ExpenseComments';
import UserCommentsPage from '../components/UserComments/UserCommentsPage';
import FriendsPage from '../components/Friends';
import UserProfilePage from '../components/UserProfile/UserProfilePage';
import Layout from './Layout';

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
        path: "/expenses/:id/payment_due",
        element: <PaymentDuePage />
      },
      {
        path: "/expenses/:id/amount_owed",
        element: <AmountOwedPage />
      },
      {
        path: "/expenses/:id/comments",
        element: <ExpenseCommentPage/>
      },
      {
        path: "/comments",
        element: <UserCommentsPage/>
      },
      {
        path: "/friends",
        element: <FriendsPage/>
      },
      {
        path: "/users/profile",
        element: <UserProfilePage />
      }
    ]
  }
])
