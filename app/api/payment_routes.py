import datetime
from flask import Blueprint, jsonify, request, redirect
from flask_login import login_required, current_user
from app.models import User, db
from app.models.payment import Payment
from app.models.expenses import Expense, expense_participants

payment_routes = Blueprint('payments', __name__)

# ! Get All Payments of the Current User
@payment_routes.route("/", methods=["GET"])
@login_required
def user_payments():

    """
    Find all payments of the current user

    Query for the user using the id from route parameters
        .join with Expense
            to find each expense where Expense.id == payment.expense_id
            to find each user where User.id == payment.payer_id
        .filter Users by the id of the current user (user.id)
            to make sure only the current user's payments are queried
    Format payment data
    Return json response
    """

    # Query to find the user
    user = User.query.get(current_user.id)

    # Join query to find all payments for this user and corresponding expenses
    payments = db.session.query(Payment, Expense).join(Expense, Payment.expense_id == Expense.id).filter(Payment.payer_id == user.id).order_by(Payment.id).all()
    if not payments:
        return jsonify({"Message": "No payments found for the current user"}), 404

    # Format payments data into JSON response
    payments_data = []

    for payment, expense in payments:

        payment_amount = expense.amount / len(expense.participants)

        payment_data = {
            "id": payment.id,
            "expenseId": {
                "description": expense.description,
                "amount": expense.amount,
                "settled": expense.settled,
                "created_by": expense.created_by,
                "created_at": expense.created_at.isoformat(),
            },
            "userId": {
                "firstName": user.first_name,
                "lastName": user.last_name,
                "email": user.email,
                "username": user.username,
            },
            "amount": payment_amount,
            "paidAt": payment.paid_at.isoformat()
        }

        payments_data.append(payment_data)

    return jsonify({"Payments": payments_data}), 200
