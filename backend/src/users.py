import datetime
from flask_restx import Namespace, Resource, fields
from .database import db
from .config import default_photo
import re
import psycopg2
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    jwt_required,
    create_access_token,
    get_jwt_identity,
)

api = Namespace("users", description="Users related operations")

############################################################
# ? User model

user_model = api.model(
    "User",
    {
        "user_id": fields.Integer(required=True, description="The user identifier"),
        "name": fields.String(required=True, description="The user name"),
        "gender": fields.String(required=True, description="The user gender"),
        "photo": fields.String(required=True, description="The user photo"),
        "email": fields.String(required=True, description="The user email"),
    },
)

user_list_model = api.model(
    "UserList",
    {
        "users": fields.List(
            fields.Nested(
                user_model,
                required=True,
                description="A single user",
            ),
            required=True,
            description="The list of users",
        )
    },
)

register_model = api.model(
    "Register",
    {
        "name": fields.String(required=True, description="The user name"),
        "gender": fields.String(required=True, description="The user gender"),
        "email": fields.String(required=True, description="The user email"),
        "password": fields.String(required=True, description="The user password"),
    },
)

login_model = api.model(
    "Login",
    {
        "email": fields.String(required=True, description="The user email"),
        "password": fields.String(required=True, description="The user password"),
    },
)

############################################################

@api.route("/get/by_id/<int:user_id>")
@api.param("user_id", "The user identifier", type="integer")
@api.response(200, "Success")
@api.response(404, "User not found")
@api.response(500, "Internal Server Error")
class GetById(Resource):
    @api.doc("get_user", model="User")
    @api.marshal_with(user_model)
    def get(self, user_id):
        """
        Get a single user by user_id.

        :param user_id: The user identifier.
        :type user_id: int
        :return: The user information.
        :rtype: dict
        """
        try:
            result = db.execute_fetchone(
                f"SELECT * FROM users WHERE user_id = {user_id}"
            )
        except psycopg2.Error:
            return {"message": "Unable to fetch user."}, 500
        if result is None:
            return {"message": "User not found"}, 404
        return result, 200

############################################################

@api.route("/get/by_email/<string:email>")
@api.param("email", "The user email", type="string")
@api.response(200, "Success")
@api.response(404, "User not found")
@api.response(500, "Internal Server Error")
class GetByEmail(Resource):
    @api.doc("get_user_by_email", model="User")
    @api.marshal_with(user_model)
    def get(self, email):
        """
        Get a single user by email.

        :param email: The user email.
        :type email: string
        :return: The user information.
        :rtype: dict
        """
        try:
            result = db.execute_fetchone(f"SELECT * FROM users WHERE email = '{email}'")
        except psycopg2.Error:
            return {"message": "Unable to fetch user."}, 500
        if result is None:
            return {"message": "User not found"}, 404
        return result, 200


############################################################


@api.route("/")
@api.response(200, "Success")
@api.response(500, "Internal Server Error")
class UserList(Resource):
    @api.doc("list_users", model="UserList")
    # @api.marshal_with(user_list_model)
    def get(self):
        """List all Users"""
        try:
            res = db.execute_fetchall(
                "SELECT user_id, name, gender, photo, email FROM Users;"
            )
        except psycopg2.Error:
            return {"message": "Unable to fetch users."}, 500
        return {"users": res}, 200


############################################################


@api.route("/register/check/email/<string:email>")
@api.param("email", "The user email", type="string")
@api.response(200, "Email available")
@api.response(400, "Invalid email format or Email already registered")
@api.response(500, "Internal Server Error")
class CheckEmail(Resource):
    @api.doc("check_email")
    def post(self, email):
        """
        Check if the given email is available for registration.

        :param email: The email to check.
        :type email: str
        :return: A message indicating whether the email is available or not.
        :rtype: dict
        """
        # Check email format
        if email is None or not re.match(
            r"^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$", email
        ):
            return {"message": "Invalid email format"}, 400

        # Check if email is already registered
        try:
            res = db.execute_fetchone(
                f"SELECT user_id, name, gender, photo, email FROM users WHERE email = '{email}'"
            )
        except psycopg2.Error:
            return {"message": "Unable to fetch user"}, 500
        if res is not None:
            return {"message": "Email already registered"}, 400

        # Email is available
        return {"message": "Email available"}, 200


############################################################

@api.route("/register")
@api.response(200, "Success")
@api.response(500, "Internal Server Error")
class RegisterUser(Resource):
    @api.doc("register", body=register_model)
    def post(self):
        """
        Register a new user.

        :return: A message indicating whether the user was registered successfully and a token for authentication.
        :rtype: dict (message, token)
        """
        # Get user info from request
        info = api.payload

        # Generate password hash
        password_hash = generate_password_hash(info["password"])

        # Generate token
        token = create_access_token(
            identity=info["email"],
            expires_delta=datetime.timedelta(days=1),
        )

        try:
            # Insert user info into database
            db.execute_alter(
                f"INSERT INTO Users (name, gender, photo, email, password_hash, token) VALUES ('{info['name']}', '{info['gender']}', '{default_photo}', '{info['email']}', '{password_hash}', '{token}');"
            )
        except psycopg2.Error:
            return {"message": "Unable to register user"}, 500

        return {"message": "User registered successfully", "token": token}, 200

############################################################

@api.route("/login")
@api.response(200, "Success")
@api.response(401, "Invalid email or password")
@api.response(500, "Internal Server Error")
class Login(Resource):
    @api.doc("login", body=login_model)
    def post(self):
        """
        Logs in a user with the provided email and password.

        :param email: The email of the user.
        :type email: str
        :param password: The password of the user.
        :type password: str

        :return: A message indicating whether the login was successful and a token for authentication.
        :rtype: dict (message, token)
        """
        # Get user info from request
        info = api.payload

        # Check if user exists
        try:
            result = db.execute_fetchone(f"SELECT * FROM Users WHERE email='{info['email']}'")
        except psycopg2.Error:
            return {"message": "Unable to fetch user"}, 500

        if result is None:
            return {"message": "Invalid email"}, 401

        # Check if password is correct
        if not check_password_hash(result["password_hash"], info["password"]):
            return {"message": "Invalid password"}, 401

        # Generate token
        token = create_access_token(
            identity=info["email"],
            expires_delta=datetime.timedelta(days=1),
        )

        # Save user token
        try:
            db.execute_alter(
                f"UPDATE Users SET token='{token}' WHERE email='{info['email']}';"
            )
        except psycopg2.Error:
            return {"message": "Unable to update user token"}, 500

        return {"message": "Login successful", "token": token}, 200

############################################################

@api.route("/delete")
@api.param("Authorization", "JWT Authorization header", type="string", required=True, _in="header")
@api.response(200, "Success")
@api.response(401, "Unauthorized")
@api.response(404, "User not found")
@api.response(500, "Internal Server Error")
class DeleteUser(Resource):

    @api.doc("delete_user")
    @jwt_required()  # requires JWT authentication
    def delete(self):
        """
        Deletes the user account associated with the JWT token in the Authorization header.

        :return: A message indicating whether the user was deleted successfully.
        :rtype: dict (message)
        """
        user_email = get_jwt_identity()  # get user email from JWT token
        try:
            # Check if user exists and is authorized to delete
            user = db.execute_fetchone(
                f"SELECT * FROM Users WHERE email = '{user_email}';"
            )
            if not user:
                return {"message": "User not found."}, 404
            if user["email"] != user_email:
                return {"message": "Unauthorized to delete user."}, 401

            # Delete user from database
            db.execute_alter(f"DELETE FROM Users WHERE email = '{user_email}';")
        except psycopg2.Error:
            return {"message": "Unable to delete user."}, 500

        return {"message": "User deleted successfully"}, 200
