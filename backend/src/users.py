from flask_restx import Namespace, Resource, fields
from .database import db
import re

api = Namespace("users", description="Users related operations")

############################################################
# ? User model

user_model = api.model(
    "User",
    {
        "user_id": fields.Integer(required=True, description="The user identifier"),
        "name": fields.String(required=True, description="The user name"),
        "gender": fields.String(required=True, description="The user gender"),
        "email": fields.String(required=True, description="The user email"),
        "password_hash": fields.String(
            required=True, description="The user password hash"
        ),
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

############################################################

@api.route("/<int:user_id>")
@api.param("user_id", "The user identifier", type="integer")
@api.response(200, "Success")
@api.response(404, "User not found")
@api.response(500, "Internal Server Error")
class User(Resource):
    @api.doc("get_user", model="User")
    @api.marshal_with(user_model)
    def get(self, user_id):
        """Fetch a User given its identifier"""
        result = db.execute_fetchone(f"SELECT * FROM users WHERE user_id = {user_id}")
        if result is None:
            return {"message": "User not found"}, 404
        return result, 200

############################################################

@api.route("/")
@api.response(200, "Success")
@api.response(500, "Internal Server Error")
class UserList(Resource):
    @api.doc("list_users", model="UserList")
    @api.marshal_with(user_list_model)
    def get(self):
        """List all Users"""
        res = db.execute_fetchall("SELECT * FROM users")
        return res, 200

############################################################

@api.route("/register/check/email/<string:email>")
@api.param("email", "The user email", type="string")
@api.response(200, "Email available")
@api.response(400, "Invalid email format or Email already registered")
class CheckEmail(Resource):
    @api.doc("check_email")
    def post(self, email):
        # Check email format
        if email is None or not re.match(
            r"^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$", email
        ):
            return {"message": "Invalid email format"}, 400

        # Check if email is already registered
        res = db.execute_fetchone(f"SELECT * FROM users WHERE email = '{email}'")
        if res is not None:
            return {"message": "Email already registered"}, 400

        # Email is available
        return {"message": "Email available"}, 200
