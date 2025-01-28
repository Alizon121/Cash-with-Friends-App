from .db import db
from datetime import datetime, timezone

class Friend(db.Model):
    __tablename__ = "friends"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    friend_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    pending_status = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

    # Relationships
    user = db.relationship("User", foreign_keys=[user_id], back_populates="friends")
    friend = db.relationship("User", foreign_keys=[friend_id], back_populates="friend_requests")

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "friend_id": self.friend_id,
            "pending_status": self.pending_status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
