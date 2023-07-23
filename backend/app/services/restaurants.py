from app import models, services

############################################################


def new_restaurant_v1(
    user: models.Users, name: str, address: str, image: str
) -> int or models.Restaurants:
    """Creates a new restaurant for the given user with
        the provided name, address, and image.

    Args:
        user (Users): The user object for the owner of the restaurant.
        name (str): The name of the restaurant.
        address (str): The address of the restaurant.
        image (str): The image of the restaurant.

    Returns:
        int or Restaurants: Returns 400 if the image format is invalid, 403 if the user already has a restaurant,
        and the created restaurant object if successful.
    """

    if not services.util.check_photo_format_v1(image):
        return 400

    # Check if user already has a restaurant
    if models.Restaurants.get_restaurant_by_owner(user.user_id) is not None:
        return 403

    return models.Restaurants.create_restaurant(
        owner_id=user.user_id, name=name, address=address, image=image
    )


def delete_restaurant_v1(user: models.Users) -> int:
    """Deletes the restaurant owned by the given user. Also deletes all comments, replies, dishes, vouchers, voucherTemplates, and vouchersAutoReleaseTimers associated with the restaurant.

    Args:
        user (Users): The user object for the owner of the restaurant.

    Returns:
        int: Returns 404 if the user does not have a restaurant, and 200 if the restaurant was successfully deleted.
    """

    restaurant: models.Restaurants = models.Restaurants.get_restaurant_by_owner(
        user.user_id
    )

    if restaurant is None:
        return 404

    services.comments.delete_all_comments_by_restaurant_v1(restaurant)
    services.dishes.delete_all_dishes_by_restaurant_v1(restaurant)
    services.voucherTemplate.delete_all_voucherTemplate_by_restaurant_v1(restaurant)
    services.vouchersAutoReleaseTimer.delete_all_vouchersAutoReleaseTimer_by_restaurant_v1(
        restaurant
    )

    models.Restaurants.delete_restaurant(restaurant.restaurant_id)

    return 200
