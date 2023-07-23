import base64
import binascii
import random
import string


def check_photo_format_v1(photo: str) -> bool:
    """Check if photo is in base64 format

    Args:
        photo (str): Photo

    Returns:
        bool: True if photo is in correct format, False otherwise
    """

    # # Remove the "data:image/png;base64," prefix if it exists
    # photo = photo.removeprefix("data:image/png;base64,")

    try:
        base64.b64decode(photo)
        return True
    except binascii.Error:
        return False


def generate_random_number(length: int) -> str:
    """
    Generates a random string of digits with the specified length.

    Args:
        length (int): The length of the random string to generate.

    Returns:
        str: A random string of digits with the specified length.
    """
    letters = string.digits
    return "".join(random.choice(letters) for _ in range(length))