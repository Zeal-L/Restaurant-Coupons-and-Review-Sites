from app.models import Users
from app.services.users import (
    check_email_exists_v1,
    check_email_format_v1,
    reset_password_v1,
    user_login_v1,
    user_register_v1,
    check_photo_format_v1,
    send_email_reset_code_v1,
    verify_and_reset_email_v1,
    send_password_reset_code_v1,
    verify_and_reset_password_v1,
)
from flask_jwt_extended import current_user, jwt_required
from flask_restx import Namespace, Resource, fields

api = Namespace("users", description="Users related operations")

############################################################
# User Models

login_model = api.model(
    "Login",
    {
        "email": fields.String(required=True, description="The user email"),
        "password": fields.String(required=True, description="The user password"),
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
        "Users": fields.List(
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

photo_model = api.model(
    "Photo",
    {
        "base64": fields.String(required=True, description="The user photo in base64"),
    },
)

token_model = api.model(
    "Token",
    {
        "message": fields.String(
            required=True,
            description="A message indicating whether the operation was successful",
        ),
        "token": fields.String(required=True, description="The user token"),
    },
)

reset_password_model = api.model(
    "ResetPassword",
    {
        "old_password": fields.String(
            required=True, description="The user old password"
        ),
        "new_password": fields.String(
            required=True, description="The user new password"
        ),
    },
)

verify_and_reset_password_model = api.model(
    "VerifyAndResetPassword",
    {
        "email": fields.String(required=True, description="The user email"),
        "reset_code": fields.String(required=True, description="The reset code"),
        "new_password": fields.String(
            required=True, description="The user new password"
        ),
    },
)

############################################################


@api.route("/register")
@api.response(200, "User registered successfully", model=token_model)
@api.response(400, "Invalid email format or Email already registered")
@api.response(
    403,
    "Invalid password format, At least 8 characters, at least 1 uppercase letter, at least 1 lowercase letter, at least 1 number",
)
class Register(Resource):
    @api.doc("register", body=register_model)
    def post(self) -> tuple[dict, int]:
        """
        Register a new user.

        Returns:
            message: A message indicating whether the registration was successful.
            token: A token for authentication.
        """

        info = api.payload

        token = user_register_v1(
            name=info["name"],
            gender=info["gender"],
            email=info["email"],
            password=info["password"],
        )

        if token == 400:
            return {"message": "Invalid email format or Email already registered"}, 400

        elif token == 403:
            return {
                "message": "Invalid password format, At least 8 characters, at least 1 uppercase letter, at least 1 lowercase letter, at least 1 number"
            }, 403

        return {"message": "User registered successfully", "token": token}, 200


############################################################


@api.route("/login")
@api.response(200, "Login successful", model=token_model)
@api.response(400, "Invalid email format or email not been registered")
@api.response(401, "Invalid password")
class Login(Resource):
    @api.doc("login", body=login_model)
    def post(self) -> tuple[dict, int]:
        """
        Logs in a user with the provided email and password.

        Returns:
            message: A message indicating whether the login was successful.
            token: A token for authentication.
        """

        info = api.payload

        token = user_login_v1(email=info["email"], password=info["password"])

        if token == 400:
            return {"message": "Invalid email format or email not been registered"}, 400
        elif token == 401:
            return {"message": "Invalid password"}, 401

        return {"message": "Login successful", "token": token}, 200


############################################################


@api.route("/check/email_available/<string:email>")
@api.param("email", "The user email", type="string")
@api.response(200, "Email available")
@api.response(400, "Invalid email format or Email already registered")
class CheckEmailAvailable(Resource):
    @api.doc("checkEmailAvailable")
    def post(self, email: str) -> tuple[dict, int]:
        """
        Check if the given email is available for registration.

        Returns:
            message: A message indicating whether the email is available.
        """

        if not check_email_format_v1(email) or check_email_exists_v1(email):
            return {"message": "Invalid email format or Email already registered"}, 400
        else:
            return {"message": "Email available"}, 200


############################################################


@api.route("/get/by_id/<int:user_id>")
@api.param("user_id", "The user identifier", type="integer")
@api.response(200, "Success")
@api.response(404, "User not found")
class GetById(Resource):
    @api.doc("get_user_by_id", model="User")
    @api.marshal_with(user_model)
    def get(self, user_id: int) -> tuple[dict, int]:
        """
        Get a single user by user_id.

        Returns:
            user: The user information.
        """

        if user := Users.query.filter_by(user_id=user_id).first():
            return user, 200
        else:
            return {"message": "User not found"}, 404


############################################################


@api.route("/get/by_email/<string:email>")
@api.param("email", "The user email", type="string")
@api.response(200, "Success")
@api.response(404, "User not found")
class GetByEmail(Resource):
    @api.doc("get_user_by_email", model="User")
    @api.marshal_with(user_model)
    def get(self, email: str) -> tuple[dict, int]:
        """
        Get a single user by email.

        Returns:
            user: The user information.
        """

        if user := Users.query.filter_by(email=email).first():
            return user, 200
        else:
            return {"message": "User not found"}, 404


############################################################


@api.route("/get/all")
@api.response(200, "Success")
@api.response(500, "Internal Server Error")
class UserList(Resource):
    @api.doc("list_users", model="UserList")
    @api.marshal_with(user_list_model)
    def get(self) -> tuple[dict, int]:
        """List all Users

        Returns:
            users: A list of users.
        """

        if users := Users.query.all():
            return {"Users": users}, 200
        else:
            return {"message": "Internal Server Error"}, 500


############################################################


@api.route("/delete")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized, invalid JWT token")
class DeleteUser(Resource):
    @api.doc("delete_user")
    @jwt_required()  # requires JWT authentication
    def delete(self) -> tuple[dict, int]:
        """
        Deletes the user account associated with the JWT token in the Authorization header.

        Returns:
            message: A message indicating whether the deletion was successful.
        """
        user: Users = current_user

        user.delete()

        return {"message": "User deleted successfully"}, 200


############################################################


@api.route("/reset/name/<string:new_name>")
@api.param("new_name", "The new user name", type="string")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized, invalid JWT token")
class ResetName(Resource):
    @api.doc("reset_name")
    @jwt_required()
    def post(self, new_name: str) -> tuple[dict, int]:
        """
        Resets the user name associated with the JWT token in the Authorization header.

        Returns:
            message: A message indicating whether the reset was successful.
        """
        user: Users = current_user
        user.set_name(new_name)

        return {"message": "Name reset successfully"}, 200


############################################################


@api.route("/reset/gender/<string:new_gender>")
@api.param("new_gender", "The new user gender", type="string")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized, invalid JWT token")
class ResetGender(Resource):
    @api.doc("reset_gender")
    @jwt_required()
    def post(self, new_gender: str) -> tuple[dict, int]:
        """
        Resets the user gender associated with the JWT token in the Authorization header.

        Returns:
            message: A message indicating whether the reset was successful.
        """
        user: Users = current_user
        user.set_gender(new_gender)

        return {"message": "Gender reset successfully"}, 200


############################################################


@api.route("/reset/photo")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(400, "Invalid photo format, must be base64")
@api.response(401, "Unauthorized, invalid JWT token")
class ResetPhoto(Resource):
    @api.doc("reset_photo", body=photo_model)
    @jwt_required()
    def post(self) -> tuple[dict, int]:
        """
        Resets the user photo associated with the JWT token in the Authorization header.

        Returns:
            message: A message indicating whether the reset was successful.
        """

        new_photo = api.payload.get("base64")

        if not check_photo_format_v1(new_photo):
            return {"message": "Invalid photo format, must be base64"}, 400

        user: Users = current_user
        user.set_photo(new_photo)

        return {"message": "Photo reset successfully"}, 200


############################################################


@api.route("/reset/email/send_reset_code/<string:new_email>")
@api.param("new_email", "The new user email", type="string")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(400, "Invalid email format or Email already registered")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(500, "Internal Server Error")
class SendEmailResetCode(Resource):
    @api.doc("send_email_reset_code")
    @jwt_required()
    def post(self, new_email: str) -> tuple[dict, int]:
        """
        Sends an email with a reset code to the new email.

        Args:
            new_email: The new email to be associated with the user.

        Returns:
            A tuple containing a dictionary with a message indicating whether the reset was successful and an integer status code.
        """

        user: Users = current_user

        res = send_email_reset_code_v1(user, new_email)

        if res == 400:
            return {"message": "Invalid email format or Email already registered"}, 400
        elif res == 500:
            return {"message": "Internal Server Error"}, 500

        return {"message": "Email reset code send successfully"}, 200


############################################################


@api.route("/reset/email/verify_reset_code/<string:reset_code>")
@api.param("reset_code", "The reset code", type="string")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success", model=token_model)
@api.response(
    400,
    "Invalid Request, the user associated with the JWT token in the Authorization header does not apply to the reset email",
)
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(403, "Reset code incorrect")
@api.response(406, "Reset code expired")
class VerifyEmailResetCode(Resource):
    @api.doc("verify_email_reset_code")
    @jwt_required()
    def post(self, reset_code: str) -> tuple[dict, int]:
        """
        Verify and reset the user's email using the reset code.

        Args:
            reset_code: The reset code associated with the user's email.

        Returns:
            A tuple containing a dictionary with a message indicating whether the email reset was successful and a new JWT token if applicable, and an integer status code.
        """

        user: Users = current_user

        res = verify_and_reset_email_v1(user, reset_code)

        if res == 400:
            return {
                "message": "Invalid Request, the user associated with the JWT token in the Authorization header does not apply to the reset email"
            }, 400
        elif res == 403:
            return {"message": "Reset code incorrect"}, 403
        elif res == 406:
            return {"message": "Reset code expired"}, 406

        return {"message": "Email reset successfully", "token": res}, 200


############################################################


@api.route("/reset/password/with_old_password")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Password reset successfully", model=token_model)
@api.response(
    400,
    "Invalid password format, At least 8 characters, at least 1 uppercase letter, at least 1 lowercase letter, at least 1 number",
)
@api.response(401, "Unauthorized, invalid JWT token or incorrect old password")
@api.response(406, "Not Acceptable, new password cannot be the same with old password")
class ResetPassword(Resource):
    @api.doc("reset_password", body=reset_password_model)
    @jwt_required()
    def post(self):
        """Reset the user's password using the old password.

        Returns:
            A tuple containing a dictionary with a message indicating whether the password reset was successful and a new JWT token if applicable, and an integer status code.
        """

        info = api.payload
        user: Users = current_user

        res = reset_password_v1(user, info["old_password"], info["new_password"])

        if res == 401:
            return {"message": "Unauthorized, incorrect old password"}, 401
        elif res == 406:
            return {
                "message": "Not Acceptable, new password cannot be the same with old password"
            }, 406
        elif res == 400:
            return {
                "message": "Invalid password format, At least 8 characters, at least 1 uppercase letter, at least 1 lowercase letter, at least 1 number"
            }, 400

        return {"message": "Password reset successfully", "token": res}, 200


############################################################


@api.route("/reset/password/send_reset_code/<string:email>")
@api.param("email", "The user email", type="string")
@api.response(200, "Success")
@api.response(403, "Invalid email format")
@api.response(404, "Email not been registered")
@api.response(500, "Internal Server Error")
class SendPasswordResetCode(Resource):
    @api.doc("send_password_reset_code")
    def post(self, email: str) -> tuple[dict, int]:
        """Send password reset code to user email
        Args:
            email (str): User email

        Returns:
            A tuple containing a dictionary with a message indicating whether the password reset code send was successful and an integer status code.
        """
        res = send_password_reset_code_v1(email)

        if res == 400:
            return {
                "message": "Invalid password format, At least 8 characters, at least 1 uppercase letter, at least 1 lowercase letter, at least 1 number"
            }, 400
        elif res == 403:
            return {"message": "Invalid email format"}, 403
        elif res == 404:
            return {"message": "Email not been registered"}, 404
        elif res == 500:
            return {"message": "Internal Server Error"}, 500

        return {"message": "Password reset code send successfully"}, 200


############################################################


@api.route("/reset/password/verify_reset_code")
@api.response(200, "Success", model=token_model)
@api.response(404, "Email not been registered")
@api.response(
    400, "Account associated with the email does not apply to the reset password"
)
@api.response(
    402,
    "Invalid password format, At least 8 characters, at least 1 uppercase letter, at least 1 lowercase letter, at least 1 number",
)
@api.response(403, "Not Acceptable, new password cannot be the same with old password")
@api.response(405, "Reset code incorrect")
@api.response(406, "Reset code expired")
class VerifyPasswordResetCode(Resource):
    @api.doc("verify_password_reset_code", body=verify_and_reset_password_model)
    def post(self) -> tuple[dict, int]:
        """Verify password reset code and reset password

        Args:
            email (str): User email
            reset_code (str): Password reset code
            new_password (str): New password

        Returns:
            A tuple containing a dictionary with a message indicating whether the password reset was successful and an integer status code.
        """

        info = api.payload

        res = verify_and_reset_password_v1(
            info["email"], info["reset_code"], info["new_password"]
        )

        if res == 404:
            return {"message": "Email not been registered"}, 404
        elif res == 400:
            return {
                "message": "Account associated with the email does not apply to the reset password"
            }, 400
        elif res == 402:
            return {
                "message": "Invalid password format, At least 8 characters, at least 1 uppercase letter, at least 1 lowercase letter, at least 1 number"
            }, 402
        elif res == 403:
            return {
                "message": "Not Acceptable, new password cannot be the same with old password"
            }, 403
        elif res == 405:
            return {"message": "Reset code incorrect"}, 405
        elif res == 406:
            return {"message": "Reset code expired"}, 406

        return {"message": "Password reset successfully", "token": res}, 200
