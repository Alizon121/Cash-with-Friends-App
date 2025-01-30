import datetime
from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from app.models import User, db
from app.models.payment import Payment
from app.models.expenses import Expense, expense_participants

payment_routes = Blueprint('payments', __name__)

# ! Get All Payments for an Expense
@payment_routes.route("/expenses/<int:id>/payments", methods=["GET"])
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

    # Query to find all payments for the expense
    payments = Payment.query.filter_by(expense_id=id).order_by(Payment.id).all()

    # Format payments data into JSON response
    payments_data = []

    for payment in payments:
        payment_data = {
            "id": payment.id,
            "expenseId": {
                "description": expense.description,
                "amount": expense.amount,
                "settled": expense.settled,
                "created_by": expense.created_by,
                # use .isoformat() for datetime objects to stay consistent?
                "created_at": expense.created_at.isoformat(),
            },
            "userId": {
                "firstName": payment.payer.first_name,
                "lastName": payment.payer.last_name,
                "email": payment.payer.email,
                "username": payment.payer.username,
            },
            "amount": payment.amount,
            "paidAt": payment.paid_at.isoformat()
        }

        payments_data.append(payment_data)

    return jsonify({"Payments": payments_data}), 200

# ! Add a Payment to an Expense
@payment_routes.route("/expenses/<int:id>/payments", methods=["POST"])
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

    # Get request data
    data = request.get_json()
    username = data.get("username")
    amount = data.get("amount")

    # Validate request data
    if not username or not amount:
        return jsonify({"message": "Validation error", "errors": {"username": "Username is required", "amount": "Amount is required"}}), 400

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
        amount=amount,
        expense_id=expense.id,
        user_id=payer.id,
        paid_at=datetime.datetime.now()  # You can customize the date if needed
    )

    # Add and commit the new payment to the database
    db.session.add(new_payment)
    db.session.commit()

    # Format response data & return json response
    payment_data = {
        "id": new_payment.id,
        "expenseId": {
            "description": expense.description,
            "amount": expense.amount,
            "settled": expense.settled,
            "created_by": expense.created_by,
            "created_at": expense.created_at.isoformat()
        },
        "userId": {
            "firstName": payer.first_name,
            "lastName": payer.last_name,
            "email": payer.email,
            "username": payer.username,
        },
        "amount": new_payment.amount,
        "paidAt": new_payment.paid_at.isoformat()
    }

    return jsonify(payment_data), 201

# ! Get All Payments of the Current User
