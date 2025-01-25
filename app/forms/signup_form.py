from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, EqualTo
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')
    



class SignUpForm(FlaskForm):
    first_name = StringField(
        'First Name', validators=[DataRequired()]
    )
    last_name = StringField("Last Name", validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), user_exists])
    username = StringField(
        'Username', validators=[DataRequired(), username_exists])
    password = StringField('Password', validators=[DataRequired()])
    confirm_password = StringField("Confirm Password", validators=[DataRequired(), EqualTo("password", message="Passwords must match")])
