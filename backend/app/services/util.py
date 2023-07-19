import base64
import binascii


def check_photo_format_v1(photo: str) -> bool:
    """Check if photo is in base64 format

    Args:
        photo (str): Photo

    Returns:
        bool: True if photo is in correct format, False otherwise
    """

    try:
        base64.b64decode(photo)
        return True
    except binascii.Error:
        return False