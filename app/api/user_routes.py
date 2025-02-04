from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Comment

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


# For the current user "comments" button (that we don't actually have yet lol)
# have a profile dropdown with all the options, create expense, add friend, view comments, 
### view payments, view expenses, etc...

@user_routes.route('/comments')
@login_required
def get_user_comments():
    user_id = current_user.id

    # Get page and per_page values from query parameters (default to page 1, per_page 10)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    # Paginate the user's comments
    comments = Comment.query.filter_by(user_id=user_id).paginate(page, per_page, False)

    # Return paginated comments with metadata
    return jsonify({
        'comments': [comment.to_dict() for comment in comments.items],
        'total': comments.total,
        'pages': comments.pages,
        'current_page': comments.page
    })
