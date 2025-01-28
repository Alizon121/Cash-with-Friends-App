from flask import Blueprint, jsonify, redirect
from flask_login import login_required, current_user
from app.models import User
from app.models.payment import Payment
from app.models.expenses import Expense

payment_routes = Blueprint('payments', __name__)

# ! Get All Payments for an Expense

@payment_routes.route("/expenses/<int:id>/payments", methods=["GET"])
@login_required
def expense_payments(id):
    """
    Find all payments related to the specified expense
    Query for every payment using the expenseId provided via route parameter (payments.id.expense_id)
    """

    # Query to find the expense
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"Message": "Expense couldn't be found"}), 404

    # Query to find all payments for the expense
    payments = Payment.query.filter_by(expense_id=id).all()

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

# ! Get All Payments of the Current User
