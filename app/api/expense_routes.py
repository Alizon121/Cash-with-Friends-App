from flask import Blueprint, redirect
from flask_login import login_required, current_user
from app.models import User
from app.models.expenses import Expense, expense_participants

expense_routes = Blueprint('expenses', __name__)

@expense_routes.route("/<int:id>/payment_due", methods=["GET"])
@login_required
def pending_expenses(id):
    '''
        Query for current users pending expenses
    '''
    if current_user.username == expense_participants.username:
        # We want the user's 
        user_expense = Expense.query.get(id)
        print(user_expense)
    else:
        return {"error": "unauthorized"}, 403
