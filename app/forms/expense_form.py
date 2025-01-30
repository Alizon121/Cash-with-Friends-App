from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, SubmitField
from wtforms.validators import DataRequired, Length
from app.models import User


class ExpenseForm(FlaskForm):
    participants=StringField("Participants", validators=[DataRequired()])
    description=StringField("Description", validators=[DataRequired(), Length(max=255, message="Description must not exceed 255 characters")])
    amount=DecimalField("Amount", validators=[DataRequired()])
    submit=SubmitField("Submit")
    # comment=StringField("Comment", validators=[DataRequired()])
    # Do we need to add a comment field? I think this should be an option for after an expense is made
    # DO WE NEED TO ADD A SETTLED FIELD? -> Default to False?
    # DO WE NEED TO ADD A CREATED_BY FIELD? -> I don't think so
    # DO I NEED TO UPDATE SEEDER DATA WITH A COMMENT KEY-VALUE?