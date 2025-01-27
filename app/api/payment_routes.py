from flask import Blueprint, redirect
from flask_login import login_required, current_user
from app.models import User
from app.models.payment import Payment

payment_routes = Blueprint('payments', __name__)

# ! Get All Payments for an Expense

@payment_routes.route("/expenses/<int:id>/payments", methods=["GET"])
@login_required
def expense_payments(id):
    """
    Find all payments related to the specified expense
    Query for every payment with the expenseId provided via route parameter (payments.id.expense_id)
    """

# ! Add a Payment to an Expense

# ! Get All Payments of the Current User
