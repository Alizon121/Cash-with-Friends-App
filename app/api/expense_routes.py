from flask import Blueprint, redirect, url_for, request
from flask_login import login_required, current_user
from datetime import datetime
from app.models import User, db, Comment
from flask import Blueprint, redirect, jsonify
from flask_login import login_required, LoginManager, current_user
from app.models import User
from app.models.expenses import Expense, expense_participants
from app.models.payment import Payment
from app.forms import CommentForm
from app.forms.expense_form import ExpenseForm



expense_routes = Blueprint('expenses', __name__)


@expense_routes.route("/users/dashboard", methods=["GET"])
@login_required
def pending_expenses():
    '''
        Query for current users pending expenses and amount owed
    '''
    # Use authorization logic here:
    if current_user.is_authenticated:
        expense_data_owed=[]
        expense_data_owes_to=[]

    ############Optimize the queries to use JOIN (Eager Loading!)###############

        total_amount = 0
        total_owed_amount = 0
        total_owes_amount = 0

        # Query to get what expenses the user is owed
        user_is_owed = User.query.get(current_user.id).expenses
        # Error message for no user being owed something
        # if not user_is_owed:
        #     return jsonify({"Message": "User is currently not owed any amount."})

        for expense in user_is_owed:
            total_amount += expense.amount
            total_owed_amount += expense.amount

            owed_data= {
            "id": expense.id,
            "amount": expense.amount,
            "description": expense.description,
            # A query inside a query results in n+1
            "username": [user.username for user in Expense.query.get(expense.id).participants],
            "settled": expense.settled,
            # "createdAt": user_is_owed["created_at"]
        }
            expense_data_owed.append(owed_data)

        # Query to get what the user owes
        user_owes = User.query.get(current_user.id).participant_expenses

        if not user_owes:
            return jsonify({"Message": "User does not currently owe anything."})

        for expense in user_owes:
            expense_owner = User.query.get(expense.created_by)
            owes_data = {
                "id": expense.id,
                "userId": current_user.id,
                "amount": (expense.amount/(len(expense.participants)+1)),
                "description": expense.description,
                "settled": expense.settled,
                "createdBy": expense_owner.username,
                "participants": [user.username for user in expense.participants],
                # "createdAt": user_owes.created_at
            }
            total_owes_amount+=(expense.amount/(len(expense.participants)+1))
            total_amount-= (expense.amount/(len(expense.participants)+1))
            expense_data_owes_to.append(owes_data)

        return jsonify({
            "expensesOwed": expense_data_owed,
            "owesExpenses": expense_data_owes_to,
            "totalAmountOwed": total_amount,
            "totalOwedAmount": total_owed_amount,
            "totalOwesAmount": total_owes_amount
                        })

    else:
        return {"error": "unauthorized"}, 403


@expense_routes.route("/<int:id>/payment_due", methods=["GET"])
def amount_user_owes(id):
    '''
        Query for current users amount OWES details (one expense)
    '''
    if current_user.is_authenticated:
        # Make a list var for returning json:
        expense_data=[]

        # Query to get  the user details for a specific expense
        expense_owes = Expense.query.join(
            expense_participants, Expense.id == expense_participants.c.expense_id
        ).filter(
            expense_participants.c.user_id == current_user.id,
            Expense.id == id
        ).first()

        if not expense_owes:
            return jsonify({"Message": "User does not currently owe any amount"}), 404

        # Query to get who the participants are in the expense
        # Will serve to get the user's amount owed
        def get_num_participants():
            find_participants = User.query.get(current_user.id).participant_expenses
            user_data = {data for data in find_participants if data.id == id} #find_participants[0].participants
            for participant in user_data:
                return len(participant.participants)

        def get_participants():
            find_participants = User.query.get(current_user.id).participant_expenses
            user_data = {data for data in find_participants if data.id == id} #find_participants[0].participants
            for participant in user_data:
                return [users.username for users in participant.participants]

        # Querying inside of a query will result in n+1 (lazy loading)

        expense_owner = User.query.get(expense_owes.id)

        owe_data = {
            "id": expense_owes.id,
            "created_by": expense_owner.username.capitalize(),
            "description": expense_owes.description,
            "amount": (expense_owes.amount/get_num_participants()),
            "settled": expense_owes.settled,
            "participants": get_participants(),
        }

        print("EXEPNSE OWNER IS:", owe_data["created_by"])

        expense_data.append(owe_data)

        return jsonify({"Expenses": expense_data})
    else:
        return {"error": "unauthorized"}, 403


@expense_routes.route("/<int:id>/amount_owed", methods=["GET"])
@login_required
def amount_user_is_owed(id):
    '''
        Query for current users amount OWED details
    '''
    expense_data = []

    # Query for the user's created expenses
    user_is_owed = User.query.get(current_user.id).expenses

    # Select only the expense that corresponds with id in path:
    expense_detail = [data for data in user_is_owed if data.id==id]

    if not expense_detail:
        return jsonify({"Error": "Expense not found or unauthorized"}), 403
    # Iterate over the queried data and add to dict:
    for expense in expense_detail:

        # Query for the number of particpants
        participants = Expense.query.get(id).participants

        # Get num of participants:
        num_participants = len(participants) if participants else 1

        # Calculate how much each particpant owes:
        participant_amount = expense.amount / num_participants

        is_owed_data = {
            "id":expense.id,
            "description": expense.description,
            "amount": expense.amount,
            "settled": expense.settled,
            # Query inside of another query results in n+1
            "participants": [user.username for user in expense.participants],
            # Query for a participants's individual amount (see above)
            "particpant_amount": participant_amount
            }

        expense_data.append(is_owed_data)

    return jsonify({"Expense": expense_data})

@expense_routes.route("/", methods=["GET", "POST"])
@login_required
def add_expense():
    form=ExpenseForm()

    # Reassign the choices attribute from the ExpenseForm with a query
    form.participants.choices = [(user.username, user.username) for user in User.query.all()]

    # Manually obtain the csrf-token from cookies
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        try:
            date_str = form.date.data
            date_obj = datetime.strptime(date_str, "%m/%d/%Y")

            participant_usernames = [username.strip() for username in form.data["participants"]]
            participants = User.query.filter(User.username.in_(participant_usernames)).all()

            if not participants:
                return jsonify({"error": "No valid participants found."}), 400

            new_expense = Expense(
                description=form.data["description"],
                amount=form.data["amount"],
                date=date_obj.isoformat(),
                created_by=current_user.id,
                settled=False,
                participants=participants
            )

            db.session.add(new_expense)
            db.session.commit()

            return jsonify({
                "Message": "Expense creation successful",
                "New Expense": new_expense.to_dict(),
                }), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    return jsonify(form.errors), 403

@expense_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_expense(id):
    select_expense = Expense.query.get(id)

    if not select_expense:
        return jsonify({"error": "Expense not found."}), 404

    # Check if the current user is authorized to delete the expense
    if select_expense.created_by != current_user.id:
        return jsonify({"error": "Unauthorized to delete this expense."}), 403

    db.session.delete(select_expense)
    db.session.commit()

    return jsonify({"Message": "Expense successfully deleted"})


@expense_routes.route("/<int:id>", methods=["PUT"])
@login_required
def update_expense(id):
    '''
        This route is for updating an expense
    '''
    # We should be able to update description, amount, and participants
    selected_expense = Expense.query.get(id)

    # Error for no expense
    if not selected_expense:
        return jsonify({"Error": "Expense not found"})

    # Authorization
    if selected_expense.created_by == current_user.id:

        # Get the json request
        data= request.get_json()

        # Update values using data:
        if "description" in data:
            description = data["description"].strip()
            if not description:
                return jsonify({"Error": "Description cannot be empty"}), 400
            selected_expense.description = data["description"]

        if "amount" in data:
            amount = data["amount"]
            if amount <= 0:
                return jsonify({"Error": "amount must be greater than $0.00"}), 403
            selected_expense.amount = data["amount"]

        # if "participants" in data:
        #     participant_usernames = data["participants"]

        #     # Query for the existing usernames
        #     participants = User.query.filter(User.username.in_(participant_usernames)).all()

        #     # We need to add a validation for checking if a user exists in the database or not
        #     existing_usernames = [user.username for user in participants]

        #     # Find usernames that do not exist in the database
        #     non_existent_usernames = [username for username in participant_usernames if username not in existing_usernames]

        #     if non_existent_usernames:
        #         return jsonify({"Error": f"These users do not exist: {', '.join(non_existent_usernames)}"}), 400

        #     selected_expense.participants = participants

        db.session.commit()

        return jsonify({
            "Message": "Expense successfully updated",
            "Updated Expense": selected_expense.to_dict()  # Assuming Expense has a to_dict() method
            }), 200


    return jsonify({"Error": "Unauthorized user"}), 403


@expense_routes.route("/<int:id>/settle", methods=["PUT"])
@login_required
def settle_expense(id):

    # Query the expense from the path
    select_expense = Expense.query.get(id)
    print(select_expense.settled)
    # Authorization
    if ",".join([user.username for user in select_expense.participants if current_user.username == user.username]):
        # Get data from the request body
        data=request.get_json()
        # print("THIS IS A BOOLEAN", data["settled"]["settled"])
        if "settled" in data["settled"]:
            # Check and make sure that the input is a Boolean
            if isinstance(data["settled"]["settled"], bool):
                select_expense.settled = data["settled"]["settled"]
                if data["settled"]["settled"]:
                    select_expense.amount = data["settled"]["amount"]
            else:
                return jsonify({"Error": "Please provide Boolean type"}), 400

        db.session.commit()

        return jsonify({
            "Message": "Expense settled",
            "Updated Expense": select_expense.to_dict()
        }), 200

    else:
        return jsonify({"Error": "User is unauthorized"})


#####################Comments/Explense Routes###########################
@expense_routes.route('/<int:id>/comments', methods=['POST'])
@login_required
def add_comment(id):
    data = request.get_json()

    # Validate that comment is not empty
    comment_text = data.get('comment_text', None)
    if not comment_text:
        return {"error": "Content cannot be empty"}, 400

    # Validate the expense's existence
    expense = Expense.query.get(id)
    if not expense:
        return {"error": "Expense not found"}, 404

    # Check if user is a participant
    if current_user not in expense.participants:
        return {"error": "You are not a participant of this expense"}, 403

    # Do the thing (add the comment)
    new_comment = Comment(
        comment_text=comment_text,
        expense_id=expense.id,
        user_id=current_user.id,
    )
    db.session.add(new_comment)
    db.session.commit()

    # Return the comment
    return {"comment": new_comment.to_dict()}, 201


@expense_routes.route('/<int:id>/comments')
@login_required
def expense_comments(id):
    # Validate the expense's existence
    expense = Expense.query.get(id)
    if not expense:
        return {"error": "Expense not found"}, 404

    # Query for all comments with the expense (paginated)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    comments = Comment.query.filter_by(expense_id=expense.id).paginate(page=page, per_page=per_page, error_out=False)

    # Return paginated comments
    return jsonify({
        'comments': [comment.to_dict() for comment in comments.items],
        'total': comments.total,
        'pages': comments.pages,
        'current_page': comments.page
    })

#################Payment/Expenses Routes#####################

# ! Get All Payments for an Expense
@expense_routes.route("/<int:id>/payments", methods=["GET"])
@login_required
def expense_payments(id):
    """
    Find all payments related to the specified expense

    Query for the expense using id from route parameters
    Query to find all Payments related to the expense
    Format payment data based on API docs
    Return json response
    """

    # Query to find the expense
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"Message": "Expense couldn't be found"}), 404

    # Join query to find all payments for this expense and corresponding users
    payments = db.session.query(Payment, User).join(User, Payment.payer_id == User.id).filter(Payment.expense_id == id).order_by(Payment.id).all()
    if not payments:
        return jsonify({"Message": "No payments found for the current expense"})

    # Format payments data into JSON response
    payments_data = []

    for payment, payer in payments:

        payment_amount = expense.amount / len(expense.participants)+1

        payment_data = {
            "id": payment.id,
            "expense": {
                "expenseId": expense.id,
                "description": expense.description,
                "amount": expense.amount,
                "settled": expense.settled,
                "created_by": expense.created_by,
                # use .isoformat() for datetime objects to stay consistent?
                "created_at": expense.created_at.isoformat(),
            },
            "user": {
                "userId": payer.id,
                "firstName": payer.first_name,
                "lastName": payer.last_name,
                "email": payer.email,
                "username": payer.username,
            },
            "amount": payment_amount,
            "paidAt": payment.paid_at.isoformat()
        }

        payments_data.append(payment_data)

    return jsonify({"Payments": payments_data}), 200

# ! Add a Payment to an Expense
@expense_routes.route("/<int:id>/payments", methods=["POST"])
@login_required
def add_payment(id):
    """
    Add a new payment to an expense

    Query for the expense using it's id
    Get the request data (username, amount paid)
    Validate request data (ensure username and amount are both present)
    Get the User from the username
    Verify that the User is a participant in the expense (query expense_participants table)
    Create new Payment record, add and commit to the db
    Format response data based on API docs
    Return json response
    """

    # Query to find the expense
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"Message": "Expense couldn't be found"}), 404

    payment_amount = expense.amount / len(expense.participants)+1

    # Get request data
    data = request.get_json()
    username = data.get("username")

    # Validate request data
    if not username:
        return jsonify({"username": "Username is required"}), 400

    # Get the user making the payment
    payer = User.query.filter_by(username=username).first()
    if not payer:
        return jsonify({"message": "User not found"}), 404

    # Check if user is a participant in the expense
    participation = db.session.query(expense_participants).filter_by(expense_id=id, user_id=payer.id).first()
    if not participation:
        return jsonify({"message": "Unauthorized"}), 403

    # Create new payment record
    new_payment = Payment(
        expense_id=expense.id,
        payer_id=payer.id,
        paid_at=datetime.datetime.now()  # You can customize the date if needed
    )

    # Add and commit the new payment to the database
    db.session.add(new_payment)
    db.session.commit()

    payment_data = {
        "id": new_payment.id,
        "expense": {
            "expenseId": expense.id,
            "description": expense.description,
            "amount": expense.amount,
            "settled": expense.settled,
            "created_by": expense.created_by,
            "created_at": expense.created_at.isoformat()
        },
        "user": {
            "userId": payer.id,
            "firstName": payer.first_name,
            "lastName": payer.last_name,
            "email": payer.email,
            "username": payer.username,
        },
        "amount": payment_amount,
        "paidAt": new_payment.paid_at.isoformat()
    }

    return jsonify(payment_data), 201
