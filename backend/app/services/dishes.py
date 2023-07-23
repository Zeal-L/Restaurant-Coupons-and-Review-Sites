from app import models, services

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
