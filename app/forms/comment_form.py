from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length
    
    
class CommentForm(FlaskForm):
    comment_text = StringField("Content", validators=[DataRequired(), Length(max=500, message="Content must not exceed 500 characters.")])
    submit = SubmitField("Submit")
    
