from sqlalchemy import Column, Integer, Text
from werkzeug.security import generate_password_hash

from . import db


class UnconfirmedUsers(db.Model):
    __tablename__: str = "UnconfirmedUsers"

    user_id: Column = Column(Integer, primary_key=True)
    name: Column = Column(Text, nullable=False)
    email: Column = Column(Text, nullable=False)
    password_hash: Column = Column(Text, nullable=False)
    confirm_code: Column = Column(Text)

    ############################################################

    def set_confirm_code(self, confirm_code: str) -> None:
        """
        Set the new confirmation code for the unconfirmed user.

        Args:
            confirm_code (str): The new confirmation code to set.
        """
        self.confirm_code = confirm_code
        db.session.commit()

    @staticmethod
    def create_unconfirmed_user(name: str, email: str, password: str) -> None:
        """
        Create a new unconfirmed user.

        Args:
            name: A string representing the name of the new unconfirmed user.
            email: A string representing the email of the new unconfirmed user.
            password: A string representing the password of the new unconfirmed user.
        """

        unconfirmed_user: UnconfirmedUsers = UnconfirmedUsers(
            name=name, email=email, password_hash=generate_password_hash(password)
        )
        db.session.add(unconfirmed_user)
        db.session.commit()
        return unconfirmed_user

    @staticmethod
    def delete_unconfirmed_user_by_id(user_id: int) -> None:
        """
        Delete an unconfirmed user by their ID.

        Args:
            user_id: An integer representing the ID of the unconfirmed user to be deleted.
        """
        UnconfirmedUsers.query.filter_by(user_id=user_id).delete()
        db.session.commit()
