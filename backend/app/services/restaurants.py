from app.models import Users, Restaurants
from .util import check_photo_format_v1

############################################################


def new_restaurant_v1(user: Users, name: str, address: str, image: str) -> int:
    if not check_photo_format_v1(image):
        return 400

    Restaurants.create_restaurant(
        owner_id=user.user_id, name=name, address=address, image=image
    )
