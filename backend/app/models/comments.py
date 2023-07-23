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
    report_num = Column(Integer, nullable=False)
    anonymity = Column(Boolean, nullable=False)
    liked_by = Column(ARRAY(Integer), nullable=False)
    disliked_by = Column(ARRAY(Integer), nullable=False)

    user = relationship(models.Users)
    restaurant = relationship(models.Restaurants)

    ############################################################

    def set_content(self, content: str) -> None:
        self.content = content
        db.session.commit()

    def set_rate(self, rate: float) -> None:
        self.rate = rate
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

    def add_liked_by(self, user_id: int) -> None:
        self.liked_by.append(user_id)
        db.session.commit()

    def remove_liked_by(self, user_id: int) -> None:
        self.liked_by.remove(user_id)
        db.session.commit()

    def add_disliked_by(self, user_id: int) -> None:
        self.disliked_by.append(user_id)
        db.session.commit()

    def remove_disliked_by(self, user_id: int) -> None:
        self.disliked_by.remove(user_id)
        db.session.commit()

    ############################################################

    @staticmethod
    def create_comment(
        user_id: int,
        restaurant_id: int,
        content: str,
        rate: float,
        date: str,
        report_num: int,
        anonymity: bool,
        liked_by: list,
        disliked_by: list,
    ) -> "Comments":
        comment = Comments(
            user_id=user_id,
            restaurant_id=restaurant_id,
            content=content,
            rate=rate,
            date=date,
            report_num=report_num,
            anonymity=anonymity,
            liked_by=liked_by,
            disliked_by=disliked_by,
        )
        db.session.add(comment)
        db.session.commit()
        return comment

    @staticmethod
    def get_comment_by_id(comment_id: int) -> "Comments" or None:
        return Comments.query.filter_by(comment_id=comment_id).one_or_none()

    @staticmethod
    def get_comments_by_user(user_id: int) -> list:
        return Comments.query.filter_by(user_id=user_id).all()

    @staticmethod
    def get_comments_by_restaurant(restaurant_id: int) -> list["Comments"]:
        return Comments.query.filter_by(restaurant_id=restaurant_id).all()

    @staticmethod
    def delete_comment(comment_id: int) -> None:
        comment = Comments.get_comment_by_id(comment_id)
        db.session.delete(comment)
        db.session.commit()
