from app import models, services

############################################################


def new_dish_v1(
    user: models.Users, name: str, price: float, description: str, image: str
) -> int or models.Dishes:
    """
    Creates a new dish object with the given parameters and returns it.

    Args:
        user (models.Users): The user object who owns the restaurant.
        name (str): The name of the dish.
        price (float): The price of the dish.
        description (str): The description of the dish.
        image (str): The image of the dish.

    Returns:
        int or models.Dishes: 404 if the user does not own a restaurant, 400 if the image is not in base64 format, otherwise the dish object.
    """

    restaurant: models.Restaurants = models.Restaurants.get_restaurant_by_owner(
        user.user_id
    )

    if restaurant is None:
        return 404

    if not services.util.check_photo_format_v1(image):
        return 400

    dish: models.Dishes = models.Dishes.create_dish(
        restaurant_id=restaurant.restaurant_id,
        name=name,
        price=price,
        description=description,
        image=image,
    )

    return dish


############################################################


def delete_dish_by_id_v1(user: models.Users, dish_id: int) -> int:
    """
    Deletes a dish with the given id if it belongs to the restaurant owned by the given user.

    Args:
        user (models.Users): The user object who owns the restaurant.
        dish_id (int): The id of the dish to delete.

    Returns:
        int: 404 if the user does not own a restaurant or the dish does not exist, otherwise None.
    """
    restaurant: models.Restaurants = models.Restaurants.get_restaurant_by_owner(
        user.user_id
    )

    if restaurant is None:
        return 404

    dish: models.Dishes = models.Dishes.get_dish_by_id(dish_id)

    if dish is None:
        return 404

    models.Dishes.delete_dish(dish_id)


############################################################


def delete_all_dishes_by_restaurant_v1(restaurant: models.Restaurants) -> None:
    """Deletes all dishes associated with the given restaurant.

    Args:
        restaurant (Restaurants): The restaurant object to delete dishes for.
    """
    dishes: list[models.Dishes] = models.Dishes.get_dishes_by_restaurant(
        restaurant.restaurant_id
    )

    for dish in dishes:
        models.Dishes.delete_dish(dish.dish_id)
