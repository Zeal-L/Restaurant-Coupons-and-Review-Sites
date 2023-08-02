from sqlalchemy import Column, Integer, Text, Float, ForeignKey
from sqlalchemy.orm import relationship

from . import db
from app import models


class Dishes(db.Model):
    __tablename__ = "Dishes"

    dish_id = Column(Integer, primary_key=True)
    restaurant_id = Column(
        Integer, ForeignKey("Restaurants.restaurant_id"), nullable=False
    )
    name = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    description = Column(Text, nullable=False)
    image = Column(Text, nullable=False)

    restaurant = relationship(models.Restaurants)

    ############################################################

    def set_name(self, name: str) -> None:
        self.name = name
        db.session.commit()

    def set_price(self, price: float) -> None:
        self.price = price
        db.session.commit()

    def set_description(self, description: str) -> None:
        self.description = description
        db.session.commit()

    def set_image(self, image: str) -> None:
        self.image = image
        db.session.commit()

    ############################################################

    @staticmethod
    def create_dish(
        restaurant_id: int, name: str, price: float, description: str, image: str
    ) -> "Dishes":
        dish = Dishes(
            restaurant_id=restaurant_id,
            name=name,
            price=price,
            description=description,
            image=image,
        )
        db.session.add(dish)
        db.session.commit()
        return dish

    @staticmethod
    def get_dish_by_id(dish_id: int) -> "Dishes" or None:
        return Dishes.query.filter_by(dish_id=dish_id).one_or_none()

    @staticmethod
    def get_dishes_by_restaurant(restaurant_id: int) -> list["Dishes"]:
        return Dishes.query.filter_by(restaurant_id=restaurant_id).all()

    @staticmethod
    def delete_dish(dish_id: int) -> None:
        dish = Dishes.get_dish_by_id(dish_id)
        db.session.delete(dish)
        db.session.commit()
