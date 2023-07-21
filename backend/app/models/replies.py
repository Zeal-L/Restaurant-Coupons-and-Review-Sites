from sqlalchemy import Column, Integer, Text, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from . import db
from .users import Users
from .comments import Comments


class Replies(db.Model):
    __tablename__ = "Replies"

    reply_id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey("Users.user_id"), nullable=False)
    comment_id = Column(Integer, ForeignKey("Comments.comment_id"), nullable=False)
    content = Column(Text, nullable=False)
    date = Column(Date, nullable=False)
    report_num = Column(Integer, nullable=False)
    anonymity = Column(Boolean, nullable=False)

    sender = relationship(Users)
    comment = relationship(Comments)

    ############################################################

    def set_content(self, content: str) -> None:
        self.content = content
        db.session.commit()

    def set_date(self, date: str) -> None:
        self.date = date
        db.session.commit()

    def set_report_num(self, report_num: int) -> None:
        self.report_num = report_num
        db.session.commit()

    def set_anonymity(self, anonymity: bool) -> None:
        self.anonymity = anonymity
        db.session.commit()

    ############################################################

    @staticmethod
    def create_reply(
        sender_id: int, comment_id: int, content: str, date: str, report_num: int, anonymity: bool
    ) -> "Replies":
        reply = Replies(
            sender_id=sender_id, comment_id=comment_id, content=content, date=date, report_num=report_num, anonymity=anonymity
        )
        db.session.add(reply)
        db.session.commit()
        return reply

    @staticmethod
    def get_reply_by_id(reply_id: int) -> "Replies" or None:
        return Replies.query.filter_by(reply_id=reply_id).one_or_none()

    @staticmethod
    def get_replies_by_comment(comment_id: int) -> list:
        return Replies.query.filter_by(comment_id=comment_id).all()

    @staticmethod
    def delete_reply(reply_id: int) -> None:
        reply = Replies.get_reply_by_id(reply_id)
        db.session.delete(reply)
        db.session.commit()
