from flask_wtf import FlaskForm
from wtforms import StringField, SelectMultipleField, DecimalField, SubmitField
from wtforms.validators import DataRequired, Length
from app.models import User


class ExpenseForm(FlaskForm):
    participants=SelectMultipleField("Participants", choices=[], coerce=str)
    description=StringField("Description", validators=[DataRequired(), Length(max=255, message="Description must not exceed 255 characters")])
    amount=DecimalField("Amount", validators=[DataRequired()])
    date=StringField("Date", validators=[DataRequired()])
    submit=SubmitField("Submit")
    # comment=StringField("Comment", validators=[DataRequired()])
    # Do we need to add a comment field? We do not need a comment field (01/31/2025)
    # DO WE NEED TO ADD A SETTLED FIELD? -> We do not need a settled field (01/31/2025)
    # DO WE NEED TO ADD A CREATED_BY FIELD? -> No we should not (01/31/2025)
