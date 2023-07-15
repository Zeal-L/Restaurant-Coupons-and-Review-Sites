from flask_jwt_extended import create_access_token
from sqlalchemy import ARRAY, Column, Integer, Text
from werkzeug.security import check_password_hash, generate_password_hash

from . import db


class Users(db.Model):
    __tablename__: str = "Users"

    user_id: Column = Column(Integer, primary_key=True)
    name: Column = Column(Text, nullable=False)
    gender: Column = Column(Text, nullable=False)
    email: Column = Column(Text, nullable=False)
    email_reset_code = Column(Text)
    password_hash: Column = Column(Text, nullable=False)
    password_reset_code = Column(Text)
    photo: Column = Column(Text)
    token: Column = Column(Text)
    saved_restaurants: Column = Column(ARRAY(Integer))

    ############################################################

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def set_password(self, new_password: str) -> None:
        self.password_hash = generate_password_hash(new_password)
        db.session.commit()

    def refresh_token(self) -> str:
        self.token = create_access_token(identity=self.email)
        db.session.commit()
        return self.token

    def delete(self) -> None:
        db.session.delete(self)
        db.session.commit()

    def set_name(self, name: str) -> None:
        self.name = name
        db.session.commit()

    def set_gender(self, gender: str) -> None:
        self.gender = gender
        db.session.commit()

    def set_email(self, email: str) -> None:
        self.email = email
        db.session.commit()

    def set_email_reset_code(self, code: str) -> None:
        self.email_reset_code = code
        db.session.commit()

    def set_password_reset_code(self, code: str) -> None:
        self.password_reset_code = code
        db.session.commit()

    def set_photo(self, photo: str) -> None:
        self.photo = photo
        db.session.commit()

    ############################################################

    @staticmethod
    def create_user(name: str, gender: str, email: str, password: str) -> "Users":
        new_user = Users(
            name=name,
            gender=gender,
            email=email,
            password_hash=generate_password_hash(password),
            photo=None,
            token=create_access_token(identity=email),
            saved_restaurants=None,
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user