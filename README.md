# Cash with Friends
***

Here is a live version of Cash with Friends:  https://cash-with-friends-app.onrender.com/

Cash with friends is a replica of the Splitwise application. The backend of the application is built on Python3 and Flask with PostgresQL database. The frontend is structured on React/Redux for creating a normalized, global state.

## Features & Implementation
***

### Single-Page App

#### React Router and Components

* Cash with Friends is a single page app with each page rendered at "/". The React router ensures that the applications components are reached by adding paths to the root route.

#### Frontend and Backend Interaction

* The data from the backend is retrieved by reaching an api endpoint. The data retrieved from the backend path is then hydrated in the Redux state, which is accessible from the frontend framework. The information passed from backend to frontend allows for secure, normalized, and efficient rendering.

### Authentication

<img width="1249" alt="Screenshot 2025-02-17 at 7 30 54 PM" src="https://github.com/user-attachments/assets/a5210f7b-e51a-4c23-ac25-321112fc5738" />

##### Landing Page

Users are required to signup or login to be authenticated. Access to all other  pages of the application will be redirected to the landing page. The application uses Flask built-in methods to inject a csrf-token into cookies and ensure that user is authenticated before navigating to other pages.

#### User Dashboard
<img width="1246" alt="Screenshot 2025-02-17 at 7 35 14 PM" src="https://github.com/user-attachments/assets/586dc882-a638-4685-b090-c7216d915a09" />

* The user dashboard displays the current user's amount owed, owes amount, and the total amount from expenses. The user dashboard page implements the expense slice of state to retrieve information that is retrieved from the database using the pending_expenses() route handler.

* The current user is able to settle an expense that the current user owes, using and UPDATE operation executed by the settle_expense() handler. The current user may view details for an expense for which a current user owes by navigating to the "expenses/:id/payment_due" page, or view details for an expense that is owed to the current user by navigating to the "expenses/:id/payment_due" page.

* The current user is able to create a new expense by setting a new Expense instance in the expenses slice of state, and add a friend by setting a new Friend instance in the friends slice of state from the user dashboard. The current also may navigate to different pages using the profile dropdown menu located on the navigation bar.

### Expense Details

The details of an expense can be viewed from two different perspectives. A user can view the Amount Owed page, which provides details about an expense which they own and within which another user owes them a certain amount. They can also view the Payment Due page, which provides details about an expense which is owned by another use and within which they owe a payment to that user. 

#### Amount Owed
<img width="1246" alt="image" src="https://github.com/user-attachments/assets/50bccdd4-6b29-4df9-a679-0c71efc88147" />

* The user is able to view all of the details of an expense that they own. These details include the total owed to them, the description of the expense, and their own username as the owner of the expense. It also includes a list of the users who owe them payments on this expense, as well as the amount that is owed by each participant. 

* The user is able to update the details of this expense using the Update Details button. They are also able to delete this expense, which settles the payments owed by all of the users who owe payments on this particular expense. Clicking either of these buttons will open a modal that the user can then use to carry out either operation.

##### Update (Expense) Details and Delete Expense modals
<img width="430" alt="image" src="https://github.com/user-attachments/assets/ffab666e-cda0-4887-b284-3488255540cf" />
<img width="430" alt="image" src="https://github.com/user-attachments/assets/f65a486c-a08b-47a4-9d2b-4f7c8e0f994f" />

#### Payment Due
<img width="1246" alt="image" src="https://github.com/user-attachments/assets/c5459f12-a7d4-440c-bee6-315ab1e14a61" />

* The user is able to view all of the details pertaining to an expense which is owned by another user and within which they owe payments to that user. These details include the total amount of the payment that they owe, the username of the owner of the expense, the details of the expense, and the usernames of other participants in the expense. This page includes two additional buttons.

* The user is able to settle the payment that they owe on the current expense using the Settle button. When the Settle button is clicked, a modal will appear that provides the user with the options to pay what they owe and Save the status of the payment as paid. They can also choose to cancel, which will close the modal without settling the expense. The View Comments button will take the user to a page which displays all of the comments on the current expense.

##### Settle Modal
<img width="1246" alt="image" src="https://github.com/user-attachments/assets/2f23a04b-b827-4ce1-8acd-717b14e6d697" />


### User Profile Page 

*The User Profile page displays the current user's basic information, including first name, last name, username, and email. A useEffect hook dispatches thunkAuthenticate() on mount to ensure the latest user data is fetched and stored in Redux. A default profile icon (FaUserCircle) is displayed alongside the user details. An "Update Profile" button is provided, which opens the Update Profile Modal when clicked.

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/41d4563e-d3fd-4f2e-9438-4ab88357d518" />


### Update User Profile page Modal

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/446bc8d7-80fb-446f-a092-61f583b10585" />

* Initializes a local state formData with users current details pre-populated in the form. The User is then able to change that data and press the button labeled as "Save Changes" and the profile page will dynamically update with the new information! The profile page modal also has a cancel button that closes the modal. 


### Add Friend Modal
<img width="1246" alt="image" src="https://github.com/user-attachments/assets/ad775dae-9439-4b1a-8669-9508535dcf9c" />

* The user is able to open the Add Friend modal by clicking on the + sign icon on the friends list or the "Add Friend" button. The Add Friend Modal component lets users enter a username (and optional nickname) to send a friend request. When the add button is clicked in confirmation. The modal checks that the username is not empty, that the user isn't already a confirmed friend, and that there are no pending or sent requests for that already existing user. It also checks to see if the user exists.

* Upon successful submission, the request is added to the SentRequests state, and the sent request is ready for the Sendee's confirmation.


#### Friends Page

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/bec759b3-6370-4a10-9143-02ef566bb477" />


* The Friends Page displays all incoming friend requests and existing friendships of the user. It is essentially the hub that controls all of those existing and pending relationships! Each request card pulls the incoming requester's first name and provides two basic actions to the user. Add or delete. These buttons update the redux state by confirming the requester as a friend when they click on add, and deleting the request entirely if they click on Delete.

### Remove Incoming Friend Request Modal
* When they click on delete an incoming request, it will open a popup modal that asks them if they're sure they want to delete the incoming request. The modal has a remove button that confirms the the user wants to delete the request and a close button that closes the popup. 


<img width="1246" alt="image" src="https://github.com/user-attachments/assets/4a203591-fefd-41e2-8a3e-f40dac974d81" />


* Additionally, the Friends Card pulls the friend's first name and has a delete button connected to it allowing the user to remove friends if needed. When the Delete Friend button is clicked a modal pops up asking the user to confirm whether or not the user wants to remove their friend from their friendslist. 

 
### Remove Friend Modal

* The Remove Friend Modal is a popup that works as a safety mechanism to ensure the user really wants to remove their friend and didn't just accidentally misclick on the button! It has a remove button that confirms that the user wants to remove their friend, which submits a request to delete the friendship. There is also a close button that just closes the popup in case the user accidentally opened the modal.

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/c3cc095e-eef9-43b5-b5b4-efe499b028a0" />

### FriendsList Sidebar 

<img width="1246" alt="image" src="https://github.com/user-attachments/assets/7964bd2b-7f39-4625-8624-273beb160baa" />

* A sidebar populates on every page other than the friends page that has all of the users existing friends. There is a + FaUserCircle Icon that when clicked, opens the modal to send a friend request. 


### User Comments Page

<img width="1321" alt="Screenshot 2025-02-19 at 11 00 09" src="https://github.com/user-attachments/assets/60e85138-296b-4704-94f4-8f2b54ba8e2e" />

* The User Comments Page is a page that populates all the comments made by the logged in user, and includes the expense description, created date, and the comment with an edit and delete option for each comment. 


### Expense Comments Page

<img width="1323" alt="Screenshot 2025-02-19 at 10 39 27" src="https://github.com/user-attachments/assets/f8e2de95-a475-46c2-90c6-6a3ca8135c5e" />

* The Expense Comments Page is a page that populates all the comments, user of each comment, and expense description that are/is associated with a single expense along with an "add comment" button that opens a modal that will allow a user to input a new comment on the associated expense. (See "Add Comment Modal" below) 


### Add Comment Modal

<img width="664" alt="Screenshot 2025-02-19 at 10 45 02" src="https://github.com/user-attachments/assets/baf0b661-3ae5-4128-99e1-d3cc8361567b" />

* The Add Comment Modal is a popup that allows a user to add a comment to an expense. This is only available to users associated with the expense. Users not associated with the expense do not have the opportunity to even see the expense, therefore, cannot comment on the expense. 



