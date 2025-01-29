from .db import db
from datetime import datetime, timezone
from sqlalchemy import UniqueConstraint


class Friend(db.Model):
    __tablename__ = "friends"
    __table_args__ = (
        UniqueConstraint("user_id", "friend_id"),
    )
   
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    friend_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    pending_status = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

  
    # Relationships
    user = db.relationship("User", foreign_keys=[user_id], back_populates="initiated_friendships")
    friend = db.relationship("User", foreign_keys=[friend_id],back_populates="received_friendships")

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "friend_id": self.friend_id,
            "pending_status": self.pending_status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }