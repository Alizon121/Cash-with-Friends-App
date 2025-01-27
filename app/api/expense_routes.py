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
        # We want the user's total amount owed
        # Get the owner of the expense
        # Get the expense description
        # Get the participants

        # Make a helper funciton to get "total amount/len(particpants)"

        user_expense = Expense.query.get(id)
        print(user_expense)
    else:
        return {"error": "unauthorized"}, 403

@expense_routes.route("/")
def amount_owed_to_current_user():
    '''
        Query for current users amount owed details
    '''
    if current_user.username == expense_participants.username:
        pass
