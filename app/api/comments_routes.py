from flask import Blueprint, request, jsonify
from app.models import Comment, db
from flask_login import login_required, current_user

comment_routes = Blueprint('comments', __name__)


@comment_routes.route('/<int:comment_id>', methods=['GET'])
@login_required
def get_comment(comment_id):
    comment = Comment.query.get(comment_id)
    
    # If the comment doesn't exist, return a 404 error
    if not comment:
        return jsonify({"error": "Comment not found"}), 404
    
    # If the comment is found, return it as a JSON response
    return jsonify({
        'id': comment.id,
        'user.username': comment.user.username,
        'comment_text': comment.comment_text,
        'created_at': comment.created_at.isoformat(),
    })


@comment_routes.route('/<int:comment_id>', methods=["PUT"])
@login_required
def edit_comment(comment_id):
    comment = Comment.query.get(comment_id)

    # If the comment doesn't exist, return an error
    if not comment:
        return {"error": "Comment not found"}, 404
    
    # Auth check: only the user who created the comment can edit it
    if comment.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403
    
    # Get the new comment text from the request
    data = request.get_json()
    new_comment_text = data.get('comment_text', None)
    
    # Validate new comment text (cannot be empty)
    if not new_comment_text:
        return {"error": "Content cannot be empty"}, 400

    # Update the comment's text
    comment.comment_text = new_comment_text
    db.session.commit()

    # Return the updated comment
    return {"comment": comment.to_dict(), "user": comment.user.to_dict()}, 200


@comment_routes.route('/<int:comment_id>', methods=["DELETE"])
@login_required
def delete_comment(comment_id):
    # Get the comment by ID
    comment = Comment.query.get(comment_id)
    
    # If the comment doesn't exist, return an error
    if not comment:
        return {"error": "Comment not found"}, 404
    
    # Auth check: only the user who created the comment can delete it
    if comment.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403
    
    # Delete the comment from the database
    db.session.delete(comment)
    db.session.commit()
    
    # Return a success message
    return {"message": "Comment deleted successfully"}, 200