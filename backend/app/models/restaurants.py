from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship

from . import db
from app import models


class Restaurants(db.Model):
    __tablename__ = "Restaurants"

    restaurant_id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("Users.user_id"), nullable=False)
    name = Column(Text, nullable=False)
    address = Column(Text, nullable=False)
    image = Column(Text, nullable=False)

    owner = relationship(models.Users)

    ############################################################

    def set_name(self, name: str) -> None:
        self.name = name
        db.session.commit()

    def set_address(self, address: str) -> None:
        self.address = address
        db.session.commit()

    def set_image(self, image: str) -> None:
        self.image = image
        db.session.commit()

    ############################################################

    @staticmethod
    def create_restaurant(
        owner_id: int, name: str, address: str, image: str
    ) -> "Restaurants":
        restaurant = Restaurants(
            owner_id=owner_id, name=name, address=address, image=image
        )
        db.session.add(restaurant)
        db.session.commit()
        return restaurant

    @staticmethod
    def get_restaurant_by_id(restaurant_id: int) -> "Restaurants" or None:
        return Restaurants.query.filter_by(restaurant_id=restaurant_id).one_or_none()

    @staticmethod
    def get_restaurant_by_owner(owner_id: int) -> "Restaurants" or None:
        return Restaurants.query.filter_by(owner_id=owner_id).one_or_none()

    @staticmethod
    def delete_restaurant(restaurant_id: int) -> None:
        restaurant = Restaurants.get_restaurant_by_id(restaurant_id)
        db.session.delete(restaurant)
        db.session.commit()
