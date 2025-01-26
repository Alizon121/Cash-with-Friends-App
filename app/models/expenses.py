from .db import db, environment, SCHEMA
from datetime import datetime, timezone

# Create the Join Table
expense_participants = db.Table(
    "expense_participants", # name of the join table
    db.Model.metadata, # Attribute for connecting the table
    db.Column("expenses", db.Integer, db.ForeignKey("expenses.id"), primary_key=True),
    db.Column("users", db.Integer, db.ForeignKey("users.id"), primary_key=True)
)


class Expense(db.Model):
    __tablename__= "expenses"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(250), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    settled = db.Column(db.Boolean, default=False)
    created_by = db.Column(db.String(250), db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    # I am not sure what method I should use to dynamically update a time
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utcnow))

    def to_dict(self):
        return {
            "id": self.id,
            "description":self.description,
            "amount": self.amount,
            "settled": self.settled,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

# Add the relationship for One-to-many:
    # Add the variable that back_populates refers to
    payments = db.relationship("Payment", back_populates="expense")
    user = db.relationship("User", back_populates="expenses")

    # Add the relationships for the JOIN:
    participants = db.relationship(
        "User", # Name of table
        secondary=expense_participants, # name of the join table
        back_populates="particpant_expenses", # variable that relationship refers to in other table
        cascade="all, delete"
        )
