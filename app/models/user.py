from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .expenses import expense_participants
from sqlalchemy.orm import relationship
from .friends import Friend



class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'username': self.username,
            'email': self.email,
            'friends': [friend.to_dict() for friend in self.friends],
            'friend_requests': [friend_request.to_dict() for friend_request in self.friend_requests]
        }

    # Add relationships here:
    payment = relationship('Payment', back_populates='payer')
    expenses = db.relationship("Expense", back_populates="user")

    # Add the JOIN table relationships here:
    particpant_expenses = db.relationship(
        "Expense",
        secondary= expense_participants,
        back_populates="participants",
        cascade="all, delete"
    )

 # New relationships for the Friend model
    friends = db.relationship(
        "Friend",
        foreign_keys="[Friend.user_id]",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    friend_requests = db.relationship(
        "Friend",
        foreign_keys="[Friend.friend_id]",
        back_populates="friend",
        cascade="all, delete-orphan"
    )