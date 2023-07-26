"""
This module defines the Users model for the application. It provides functionality for creating, updating, and deleting users,
as well as setting and resetting passwords and email addresses. It also includes methods for generating access tokens and
managing saved restaurants.
"""

from flask_jwt_extended import create_access_token
from sqlalchemy import ARRAY, Column, Integer, Text
from werkzeug.security import check_password_hash, generate_password_hash

from . import db


class Users(db.Model):
    __tablename__: str = "Users"

    user_id: Column = Column(Integer, primary_key=True)
    name: Column = Column(Text, nullable=False)
    email: Column = Column(Text, nullable=False)
    email_reset_code = Column(Text)
    password_hash: Column = Column(Text, nullable=False)
    password_reset_code = Column(Text)
    photo: Column = Column(Text)
    token: Column = Column(Text)
    favorite_restaurants: Column = Column(ARRAY(Integer))

    ############################################################

    def check_password(self, password: str) -> bool:
        """
        Check if the provided password matches the user's password hash.

        Args:
            password (str): The password to check.

        Returns:
            bool: True if the password matches the user's password hash, False otherwise.
        """
        return check_password_hash(self.password_hash, password)

    def set_password(self, new_password: str) -> None:
        """
        Set a new password for the user.

        Args:
            new_password (str): The new password to set.
        """
        self.password_hash = generate_password_hash(new_password)
        db.session.commit()

    def refresh_token(self) -> str:
        """
        Generate a new access token for the user.

        Returns:
            str: The new access token.
        """
        self.token = create_access_token(identity=self.email)
        db.session.commit()
        return self.token

    def delete(self) -> None:
        """
        Delete the user from the database.
        """
        db.session.delete(self)
        db.session.commit()

    def set_name(self, name: str) -> None:
        """
        Set the user's name.

        Args:
            name (str): The new name to set.
        """
        self.name = name
        db.session.commit()

    def set_email(self, email: str) -> None:
        """
        Set the user's email.

        Args:
            email (str): The new email to set.
        """
        self.email = email
        db.session.commit()

    def set_email_reset_code(self, code: str) -> None:
        """
        Set the user's email reset code.

        Args:
            code (str): The new email reset code to set.
        """
        self.email_reset_code = code
        db.session.commit()

    def set_password_reset_code(self, code: str) -> None:
        """
        Set the user's password reset code.

        Args:
            code (str): The new password reset code to set.
        """
        self.password_reset_code = code
        db.session.commit()

    def set_photo(self, photo: str) -> None:
        """
        Set the user's photo.

        Args:
            photo (str): The new photo to set.
        """
        self.photo = photo
        db.session.commit()

    def add_favorite_restaurants(self, restaurant_id: int) -> bool:
        """
        Add a restaurant to the user's list of favorite restaurants.

        Args:
            restaurant_id (int): The restaurant to add.

        Returns:
            bool: True if the restaurant was added, False if it was already in the list.
        """
        if self.favorite_restaurants is None:
            self.favorite_restaurants = []
        if restaurant_id in self.favorite_restaurants:
            return False
        self.favorite_restaurants.append(restaurant_id)
        db.session.commit()
        return True

    def remove_favorite_restaurants(self, restaurant_id: int) -> None:
        """
        Remove a restaurant from the user's list of favorite restaurants.

        Args:
            restaurant_id (int): The restaurant to remove.

        Returns:
            bool: True if the restaurant was removed, False if it was not in the list.
        """
        if (
            self.favorite_restaurants is None
            or restaurant_id not in self.favorite_restaurants
        ):
            return False
        self.favorite_restaurants = self.favorite_restaurants.remove(restaurant_id)
        db.session.commit()
        return True

    def is_favorite_restaurant(self, restaurant_id: int) -> bool:
        """
        Check if a restaurant is in the user's list of favorite restaurants.

        Args:
            restaurant_id (int): The restaurant to check.

        Returns:
            bool: True if the restaurant is in the list, False otherwise.
        """
        if self.favorite_restaurants is None:
            return False
        return restaurant_id in self.favorite_restaurants

    ############################################################

    @staticmethod
    def create_user(name: str, email: str, password: str) -> "Users":
        """
        Create a new user.

        Args:
            name (str): The user's name.
            email (str): The user's email.
            password (str): The user's password.

        Returns:
            Users: The newly created user.
        """
        new_user = Users(
            name=name,
            email=email,
            password_hash=generate_password_hash(password),
            photo=None,
            token=create_access_token(identity=email),
            favorite_restaurants=None,
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user
