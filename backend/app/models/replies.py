from sqlalchemy import ARRAY, Column, Integer, Text, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from . import db

from app import models


class Replies(db.Model):
    """
    A class used to represent a reply to a comment.

    Attributes:
        reply_id (int): The id of the reply.
        user_id (int): The id of the user who made the reply.
        comment_id (int): The id of the comment that the reply is replying to.
        content (str): The content of the reply.
        date (Date): The date the reply was made.
        anonymity (bool): Whether the reply is anonymous or not.
        report_by (list[int]): A list of user ids who reported the reply.
        user (Users): The user who made the reply.
        comment (Comments): The comment that the reply is replying to.
    """

    __tablename__ = "Replies"

    reply_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("Users.user_id"), nullable=False)
    comment_id = Column(Integer, ForeignKey("Comments.comment_id"), nullable=False)
    content = Column(Text, nullable=False)
    date = Column(Date, nullable=False)
    anonymity = Column(Boolean, nullable=False)
    report_by = Column(ARRAY(Integer))

    user = relationship(models.Users)
    comment = relationship(models.Comments)

    ############################################################

    def add_report_by(self, user_id: int) -> bool:
        """
        Adds a user_id to the report_by list of the reply.

        Args:
            user_id (int): The id of the user to add to the report_by list.

        Returns:
            bool: True if the user was added to the report_by list, False otherwise.
        """
        if self.report_by is None:
            self.report_by = []
        if user_id in self.report_by:
            return False
        self.report_by.append(user_id)
        db.session.commit()
        return True

    def get_report_num(self) -> int:
        """
        Returns the number of reports for the reply.

        Returns:
            int: The number of reports for the reply.
        """
        return 0 if self.report_by is None else len(self.report_by)

    ############################################################

    @staticmethod
    def create_reply(
        user_id: int,
        comment_id: int,
        content: str,
        date: str,
        anonymity: bool,
    ) -> "Replies":
        """
        Creates a new reply.

        Args:
            user_id (int): The id of the user who made the reply.
            comment_id (int): The id of the comment that the reply is replying to.
            content (str): The content of the reply.
            date (str): The date the reply was made.
            anonymity (bool): Whether the reply is anonymous or not.

        Returns:
            Replies: The newly created reply.
        """
        reply = Replies(
            user_id=user_id,
            comment_id=comment_id,
            content=content,
            date=date,
            anonymity=anonymity,
            report_by=None,
        )
        db.session.add(reply)
        db.session.commit()
        return reply

    @staticmethod
    def get_reply_by_id(reply_id: int) -> "Replies" or None:
        """
        Gets a reply by its id.

        Args:
            reply_id (int): The id of the reply to get.

        Returns:
            Replies or None: The reply with the given id, or None if it does not exist.
        """
        return Replies.query.filter_by(reply_id=reply_id).one_or_none()

    @staticmethod
    def get_replies_by_comment_id(comment_id: int) -> list["Replies"]:
        """
        Gets all replies to a comment.

        Args:
            comment_id (int): The id of the comment to get replies for.

        Returns:
            list[Replies]: A list of all replies to the comment.
        """
        return Replies.query.filter_by(comment_id=comment_id).all()

    @staticmethod
    def delete_reply(reply_id: int) -> None:
        """
        Deletes a reply.

        Args:
            reply_id (int): The id of the reply to delete.
        """
        reply = Replies.get_reply_by_id(reply_id)
        db.session.delete(reply)
        db.session.commit()
