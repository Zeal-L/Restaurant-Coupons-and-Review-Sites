from sqlalchemy import Column, Integer, Text, Float, Date, Boolean, ARRAY, ForeignKey
from sqlalchemy.orm import relationship

from . import db

from app import models


class Comments(db.Model):
    __tablename__ = "Comments"

    comment_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("Users.user_id"), nullable=False)
    restaurant_id = Column(
        Integer, ForeignKey("Restaurants.restaurant_id"), nullable=False
    )
    content = Column(Text, nullable=False)
    rate = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    anonymity = Column(Boolean, nullable=False)
    report_by = Column(ARRAY(Integer))
    liked_by = Column(ARRAY(Integer))
    disliked_by = Column(ARRAY(Integer))

    user = relationship(models.Users)
    restaurant = relationship(models.Restaurants)

    ############################################################

    def add_report_by(self, user_id: int) -> bool:
        """
        Adds a user_id to the report_by list of the comment.

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
        Returns the number of reports for the comment.

        Returns:
            int: The number of reports for the comment.
        """
        return 0 if self.report_by is None else len(self.report_by)

    def add_liked_by(self, user_id: int) -> bool:
        """
        Adds a user_id to the liked_by list of the comment.

        Args:
            user_id (int): The id of the user to add to the liked_by list.
            If the user is already in the disliked_by list, it will be removed from it.

        Returns:
            bool: True if the user was added to the liked_by list, False otherwise.
        """
        if self.liked_by is None:
            self.liked_by = []
        if user_id in self.liked_by:
            return False
        if user_id in self.disliked_by:
            self.disliked_by = self.disliked_by.remove(user_id)
        self.liked_by.append(user_id)
        db.session.commit()
        return True

    def remove_liked_by(self, user_id: int) -> bool:
        """
        Removes a user_id from the liked_by list of the comment.

        Args:
            user_id (int): The id of the user to remove from the liked_by list.

        Returns:
            bool: True if the user was removed from the liked_by list, False otherwise.
        """
        if self.liked_by is None or user_id not in self.liked_by:
            return False

        self.liked_by = self.liked_by.remove(user_id)
        db.session.commit()
        return True

    def add_disliked_by(self, user_id: int) -> bool:
        """
        Adds a user_id to the disliked_by list of the comment.

        Args:
            user_id (int): The id of the user to add to the disliked_by list.
            If the user is already in the liked_by list, it will be removed from it.

        Returns:
            bool: True if the user was added to the disliked_by list, False otherwise.
        """
        if self.disliked_by is None:
            self.disliked_by = []
        if user_id in self.disliked_by:
            return False
        if user_id in self.liked_by:
            self.liked_by = self.liked_by.remove(user_id)
        self.disliked_by.append(user_id)
        db.session.commit()
        return True

    def remove_disliked_by(self, user_id: int) -> bool:
        """
        Removes a user_id from the disliked_by list of the comment.

        Args:
            user_id (int): The id of the user to remove from the disliked_by list.

        Returns:
            bool: True if the user was removed from the disliked_by list, False otherwise.
        """
        if self.disliked_by is None or user_id not in self.disliked_by:
            return False

        self.disliked_by = self.disliked_by.remove(user_id)
        db.session.commit()
        return True

    ############################################################

    @staticmethod
    def create_comment(
        user_id: int,
        restaurant_id: int,
        content: str,
        rate: float,
        date: str,
        anonymity: bool,
    ) -> "Comments":
        """
        Creates a new comment object and adds it to the database.

        Args:
            user_id (int): The id of the user who created the comment.
            restaurant_id (int): The id of the restaurant the comment is for.
            content (str): The content of the comment.
            rate (float): The rating given to the restaurant by the user.
            date (str): The date the comment was created.
            anonymity (bool): Whether the comment is anonymous or not.

        Returns:
            Comments: The newly created comment object.
        """
        comment = Comments(
            user_id=user_id,
            restaurant_id=restaurant_id,
            content=content,
            rate=rate,
            date=date,
            anonymity=anonymity,
            report_by=None,
            liked_by=None,
            disliked_by=None,
        )
        db.session.add(comment)
        db.session.commit()
        return comment

    @staticmethod
    def get_comment_by_id(comment_id: int) -> "Comments" or None:
        """
        Retrieves a comment from the database by its id.

        Args:
            comment_id (int): The id of the comment to retrieve.

        Returns:
            Comments or None: The comment object if found, None otherwise.
        """
        return Comments.query.filter_by(comment_id=comment_id).one_or_none()

    @staticmethod
    def get_comments_by_restaurant_id(restaurant_id: int) -> list["Comments"]:
        """
        Retrieves all comments for a given restaurant from the database.

        Args:
            restaurant_id (int): The id of the restaurant to retrieve comments for.

        Returns:
            list[Comments]: A list of comment objects for the given restaurant.
        """
        return Comments.query.filter_by(restaurant_id=restaurant_id).all()

    @staticmethod
    def delete_comment(comment_id: int) -> None:
        """
        Deletes a comment from the database.

        Args:
            comment_id (int): The id of the comment to be deleted.
        """
        comment = Comments.get_comment_by_id(comment_id)
        db.session.delete(comment)
        db.session.commit()
