from flask_wtf import FlaskForm
from wtforms import StringField, SelectMultipleField, DecimalField, SubmitField
from wtforms.validators import DataRequired, Length, Regexp
from app.models import User


class ExpenseForm(FlaskForm):
    participants=SelectMultipleField("Participants", choices=[], coerce=str)
    description=StringField("Description", validators=[DataRequired(message="Description is required"), Length(max=255, message="Description must not exceed 255 characters")])
    amount=DecimalField("Amount", validators=[DataRequired(message="Amount is required")])
    date=StringField("Date", validators=[DataRequired(message="Date is required"), Regexp(r"^(0[1-9]|1[0-2])/(0[1-9]|1[0-9]|2[0-9]|3[01])/(\d{4})$", message="Date must be in the format mm/dd/yyyy")])
    submit=SubmitField("Submit")
    # comment=StringField("Comment", validators=[DataRequired()])
    # Do we need to add a comment field? We do not need a comment field (01/31/2025)
    # DO WE NEED TO ADD A SETTLED FIELD? -> We do not need a settled field (01/31/2025)
    # DO WE NEED TO ADD A CREATED_BY FIELD? -> No we should not (01/31/2025)
