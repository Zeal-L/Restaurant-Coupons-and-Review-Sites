import json
import re
import smtplib
import time


from app import models, services


############################################################


def check_email_format_v1(email: str) -> bool:
    """Check if email is in correct format

    Args:
        email (str): User email

    Returns:
        bool: True if email is in correct format, False otherwise
    """

    return bool(
        email is not None
        and re.match(r"^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$", email)
    )


############################################################


def check_password_format_v1(password: str) -> bool:
    """Check if password is in correct format

    Correct format: At least 8 characters, at least 1 uppercase letter,
                    at least 1 lowercase letter, at least 1 number

    Args:
        password (str): User password

    Returns:
        bool: True if password is in correct format, False otherwise
    """

    if password is None:
        return False

    if len(password) < 8:
        return False

    if not re.search(r"[A-Z]", password):
        return False

    if not re.search(r"[a-z]", password):
        return False

    return bool(re.search(r"[0-9]", password))


############################################################


def check_email_exists_v1(email: str) -> bool:
    """Check if email exists in database

    Args:
        email (str): User email

    Returns:
        bool: True if email exists, False otherwise
    """

    return bool(models.Users.query.filter_by(email=email).first())


############################################################


def user_register_v1(name: str, email: str, password: str) -> str or dict:
    """Registers a new user with the given name, email and password.

    Args:
        name (str): User name
        email (str): User email
        password (str): User password

    Returns:
        str or dict: User token if registration is successful, 400 if email is invalid or already exists, 403 if password is invalid
    """

    if not check_email_format_v1(email) or check_email_exists_v1(email):
        return 400

    if not check_password_format_v1(password):
        return 403

    new_user = models.Users.create_user(name, email, password)

    return {
        "user_id": new_user.user_id,
        "token": new_user.token,
    }


############################################################


def user_register_sent_code_v1(name: str, email: str, password: str) -> str or int:
    """
    Registers a new user with the given name, email and password and sends a confirmation code to the user's email. It also deletes any unconfirmed users that have expired confirmation codes.

    Args:
        name (str): User name
        email (str): User email
        password (str): User password

    Returns:
        str: 200 if registration is successful, 400 if email is invalid or already exists, 403 if password is invalid, 500 if email fails to send
    """

    clear_unconfirmed_user_v1()

    if not check_email_format_v1(email) or check_email_exists_v1(email):
        return 400

    if not check_password_format_v1(password):
        return 403

    unconfirmed_user: models.UnconfirmedUsers = (
        models.UnconfirmedUsers.create_unconfirmed_user(name, email, password)
    )

    confirm_code = services.util.generate_random_number(6)

    confirm_json = {
        "code": confirm_code,
        "expiration": time.time() + 5 * 60,
    }

    unconfirmed_user.set_confirm_code(json.dumps(confirm_json))

    try:
        body = f"Your reset code is {confirm_code}.\n"
        body += "Please use this code to confirm your registration.\n"
        body += "This code will expire in 5 minutes."
        services.util.send_email(
            email,
            {
                "header": "Donut Voucher Registration confirm Code",
                "body": body,
            },
        )
    except smtplib.SMTPResponseException:
        return 500

    return 200


############################################################


def verify_user_register_sent_code_v1(email: str, confirm_code: str) -> str or int:
    unconfirmed_user: models.UnconfirmedUsers = models.UnconfirmedUsers.query.filter_by(
        email=email
    ).one_or_none()
    if unconfirmed_user is None:
        return 404

    confirm_json = json.loads(unconfirmed_user.confirm_code)

    if confirm_code != confirm_json["code"]:
        return 403

    if time.time() > confirm_json["expiration"]:
        return 406

    res = user_register_v1(
        unconfirmed_user.name, unconfirmed_user.email, unconfirmed_user.password_hash
    )

    user: models.Users = models.Users.query.filter_by(email=email).one_or_none()
    user.password_hash = unconfirmed_user.password_hash

    models.UnconfirmedUsers.delete_unconfirmed_user_by_id(unconfirmed_user.user_id)

    return res["token"]


############################################################


def clear_unconfirmed_user_v1() -> None:
    """Clears unconfirmed users that have expired confirmation codes.

    Returns:
        None
    """
    for unconfirmed_user in models.UnconfirmedUsers.query.all():
        confirm_code = json.loads(unconfirmed_user.confirm_code)
        if time.time() > confirm_code["expiration"] and (
            models.Users.query.filter_by(email=unconfirmed_user.email).first() is None
        ):
            models.UnconfirmedUsers.delete_unconfirmed_user_by_id(
                unconfirmed_user.user_id
            )


############################################################


def user_login_v1(email: str, password: str) -> str or int:
    """Logs in a user with the given email and password.

    Args:
        email (str): User email
        password (str): User password

    Returns:
        str: User token if login is successful, 400 if email is invalid,
            401 if password is incorrect
    """

    if not check_email_format_v1(email) or not check_email_exists_v1(email):
        return 400

    user: models.Users = models.Users.query.filter_by(email=email).first()
    if not user.check_password(password):
        return 401

    user.refresh_token()

    return user.token


############################################################


def send_email_reset_code_v1(user: models.Users, new_email: str) -> str or int:
    """Send a reset code for the given email.

    Args:
        email (str): User email

    Returns:
        int: Reset code if email is valid, 400 otherwise
    """

    if not check_email_format_v1(new_email) or check_email_exists_v1(new_email):
        return 400

    reset_code = services.util.generate_random_number(6)

    reset_json = {
        "code": reset_code,
        "expiration": time.time() + 5 * 60,
        "new_email": new_email,
    }

    user.set_email_reset_code(json.dumps(reset_json))

    try:
        body = f"Your reset code is {reset_code}.\n"
        body += "Please use this code to reset your email.\n"
        body += "This code will expire in 5 minutes."
        services.util.send_email(
            new_email,
            {
                "header": "Donut Voucher E-mail Reset Code",
                "body": body,
            },
        )
    except smtplib.SMTPResponseException:
        return 500

    return reset_code


############################################################


def verify_and_reset_email_v1(user: models.Users, reset_code):
    if user.email_reset_code is None:
        return 400

    reset_json = json.loads(user.email_reset_code)

    if reset_code != reset_json["code"]:
        return 403

    if time.time() > reset_json["expiration"]:
        return 406

    user.set_email_reset_code(None)
    user.set_email(reset_json["new_email"])

    return user.refresh_token()


############################################################


def reset_password_v1(
    user: models.Users, old_password: str, new_password: str
) -> str or int:
    """
    Resets the user's password if the old password is correct and the new password is valid.

    Args:
        user (UserORM): The user object to reset the password for.
        old_password (str): The user's old password.
        new_password (str): The user's new password.

    Returns:
        str or int: If the password reset is successful, returns the user's refreshed token.
                    Otherwise, returns an error code.
    """

    if not user.check_password(old_password):
        return 401

    if old_password == new_password:
        return 406

    if not check_password_format_v1(new_password):
        return 400

    user.set_password(new_password)
    return user.refresh_token()


############################################################


def send_password_reset_code_v1(email: str) -> str or int:
    """
    Sends a password reset code to the given email.

    Args:
        email (str): The email to send the password reset code to.

    Returns:
        str or int: If the email is valid and the code is successfully sent, returns the reset code.
                    Otherwise, returns an error code.
    """
    if not check_email_format_v1(email):
        return 403

    user: models.Users = models.Users.query.filter_by(email=email).one_or_none()
    if not user:
        return 404

    reset_code = services.util.generate_random_number(6)

    reset_json = {
        "code": reset_code,
        "expiration": time.time() + 5 * 60,
    }

    user.set_password_reset_code(json.dumps(reset_json))

    try:
        body = f"Your password reset code is {reset_code}.\n"
        body += "Please use this code to reset your password.\n"
        body += "This code will expire in 5 minutes."
        services.util.send_email(
            email,
            {
                "header": "Donut Voucher Password Reset Code",
                "body": body,
            },
        )
    except smtplib.SMTPResponseException:
        return 500

    return reset_code


############################################################


def verify_and_reset_password_v1(
    email: str, reset_code: str, new_password: str
) -> str or int:
    """
    Verifies the reset code and resets the user's password.

    Args:
        email (str): The email of the user.
        reset_code (str): The reset code sent to the user's email.
        new_password (str): The new password to set.

    Returns:
        str or int: If the reset code is valid and the password is successfully reset,
                    returns the user's refresh token. Otherwise, returns an error code.
    """
    user: models.Users = models.Users.query.filter_by(email=email).one_or_none()
    if not user:
        return 404

    if user.password_reset_code is None:
        return 400

    reset_json = json.loads(user.password_reset_code)

    if not check_password_format_v1(new_password):
        return 402

    if user.check_password(new_password):
        return 403

    if reset_code != reset_json["code"]:
        return 405

    if time.time() > reset_json["expiration"]:
        return 406

    user.set_password_reset_code(None)
    user.set_password(new_password)

    return user.refresh_token()


############################################################


def delete_user_v1(user: models.Users) -> None:
    """
    Deletes the specified user and their associated restaurant (if any).

    Args:
        user (Users): The user to delete.

    Returns:
        None
    """
    if models.Restaurants.get_restaurant_by_owner(user.user_id) is not None:
        services.restaurants.delete_restaurant_v1(user)

    user.delete()
