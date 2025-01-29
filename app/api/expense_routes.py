from flask import Blueprint, redirect, jsonify
from flask_login import login_required, LoginManager, current_user
from app.models import User
from app.models.expenses import Expense, expense_participants



expense_routes = Blueprint('expenses', __name__)


@expense_routes.route("/users/dashboard", methods=["GET"])
@login_required
def pending_expenses():
    '''
        Query for current users pending expenses and amount owed 
    '''
    # Use authorization logic here:
    if current_user.is_authenticated:
        expense_data=[]

        # Query to get what the user is owed
        '''
        {'id': 1, 'description': 'AYCE dinner with friends', 'amount': 90.0, 
        'settled': False, 'created_by': 1, 
        'created_at': '2025-01-28T19:45:08.554022', 
        'updated_at': '2025-01-28T19:45:08.554039'
        }
        '''
        user_is_owed = User.query.get(current_user.id).expenses[0].to_dict()
        
        # Error message for no user being owed something
        if not user_is_owed:
            return jsonify({"Message": "User is currently not owed any amount."})
        
        owed_data= {
            "id": user_is_owed["id"],
            "amount": user_is_owed["amount"],
            "settled": user_is_owed["settled"],
            # "createdAt": user_is_owed["created_at"]
        }

        expense_data.append(owed_data)

        # Query to get what the user owes
        user_owes = User.query.get(current_user.id).participant_expenses

        if not user_owes:
            return jsonify({"Message": "User does not currently owe anything."})

        for expense in user_owes:
            owes_data = {
                "id": expense.id,
                "userId": current_user.id, 
                "amount": (expense.amount/len(expense.participants)),
                "description": expense.description,
                "settled": expense.settled,
                "createdBy": expense.created_by,
                "participants": [user.username for user in expense.participants],
                # "createdAt": user_owes.created_at
            }
        
        expense_data.append(owes_data)

        return jsonify({"Expenses": expense_data})
    
    else:
        return {"error": "unauthorized"}, 403


@expense_routes.route("/<int:id>/payment_due")
def amount_user_owes(id):
    '''
        Query for current users amount OWES details
    '''

    '''
        What one of the expenses returns:
        {'id': 8, 'description': 'Wifi!!', 'amount': 18.0, 
        'settled': False, 'created_by': 5, 
        'created_at': '2025-01-28T19:45:08.554022', 
        'updated_at': '2025-01-28T19:45:08.554039'}
    '''
    if current_user.is_authenticated:
        # Query to get the what the user owes for a specific expense
        expense_owes = Expense.query.join(
            expense_participants, Expense.id == expense_participants.c.expense_id
        ).filter(
            expense_participants.c.user_id == current_user.id,
            Expense.id == id
        ).first()
        print("ILBAFILAJBEFLIAJFBLAIFHJB", expense_owes)
        
        # Use list to format into JSON
        expense_data = []



    else:
        return {"error": "unauthorized"}, 403


@expense_routes.route("/<int:id>/amount_owed", methods=["GET"])
def amount_user_is_owed():
    '''
        Query for current users amount OWED details
    '''
    if current_user.username == expense_participants.user_id.username:
        expense_owed = Expense.query.get(id)