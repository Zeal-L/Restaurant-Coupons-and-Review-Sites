from app import models, services

############################################################


def delete_all_comments_by_restaurant_v1(restaurant: models.Restaurants) -> None:
    """Deletes all comments and replies associated with the given restaurant.

    Args:
        restaurant (Restaurants): The restaurant object to delete comments and replies for.
    """
    comments: list[models.Comments] = models.Comments.get_comments_by_restaurant_id(
        restaurant.restaurant_id
    )

    for comment in comments:
        services.replies.delete_all_replies_by_comment_v1(comment)
        models.Comments.delete_comment(comment.comment_id)
