from flask import Blueprint, redirect
from flask_login import login_required, current_user
from app.models import User
from app.models.payment import Payment

payment_routes = Blueprint('payments', __name__)
