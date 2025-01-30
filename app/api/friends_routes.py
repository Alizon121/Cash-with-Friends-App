from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Friend, User

friends_routes = Blueprint("friends", __name__)

@friends_routes.route("", methods=["POST"])
@login_required
def send_friend_request():
    """Send a friend request to another user."""
    data = request.get_json()
    friend_id = data.get("friend_id")

    if not friend_id:
        return jsonify({"error": "Friend ID is required"}), 400

    friend = User.query.get(friend_id)
    if not friend:
        return jsonify({"error": "User not found"}), 404

    existing_friendship = Friend.query.filter_by(user_id=current_user.id, friend_id=friend_id).first()
    if existing_friendship:
        return jsonify({"error": "Friend request already sent or user is already your friend"}), 400

    new_friend_request = Friend(user_id=current_user.id, friend_id=friend_id, pending_status=True)
    db.session.add(new_friend_request)
    db.session.commit()

    return jsonify({"message": "Friend request sent successfully"}), 201

@friends_routes.route("/<int:friend_id>", methods=["PUT"])
@login_required
def respond_to_friend_request(friend_id):
    """Accept or reject a friend request."""
    data = request.get_json()
    accept = data.get("accept")

    friend_request = Friend.query.filter_by(user_id=friend_id, friend_id=current_user.id, pending_status=True).first()
    if not friend_request:
        return jsonify({"error": "No pending friend request found"}), 404

    if accept:
        friend_request.pending_status = False
        db.session.commit()
        return jsonify({"message": "Friend request accepted"}), 200
    else:
        db.session.delete(friend_request)
        db.session.commit()
        return jsonify({"message": "Friend request rejected"}), 200

@friends_routes.route("", methods=["GET"])
@login_required
def get_all_friends():
    """Retrieve all friends of the logged-in user."""
    friendships = Friend.query.filter(
        (Friend.user_id == current_user.id) | (Friend.friend_id == current_user.id),
        Friend.pending_status == False
    ).all()

    friends_list = []
    for friendship in friendships:
        friend_id = friendship.friend_id if friendship.user_id == current_user.id else friendship.user_id
        friend = User.query.get(friend_id)
        friends_list.append({
            "id": friend.id,
            "username": friend.username,
            "email": friend.email
        })

    return jsonify({"friends": friends_list}), 200

@friends_routes.route("/<int:friend_id>", methods=["DELETE"])
@login_required
def remove_friend(friend_id):
    """Remove a friend or cancel a pending request."""
    friendship = Friend.query.filter(
        ((Friend.user_id == current_user.id) & (Friend.friend_id == friend_id)) |
        ((Friend.friend_id == current_user.id) & (Friend.user_id == friend_id))
    ).first()

    if not friendship:
        return jsonify({"error": "Friendship not found"}), 404

    db.session.delete(friendship)
    db.session.commit()
    return jsonify({"message": "Friendship removed"}), 200
