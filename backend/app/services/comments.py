from datetime import datetime
from app import models, services

############################################################


def new_comment_v1(
    user: models.Users,
    restaurant: models.Restaurants,
    content: str,
    rate: float,
    anonymity: bool,
) -> int or models.Comments:
    """Creates a new comment associated with the given user and restaurant.

    Args:
        user (Users): The user object to associate the comment with.
        restaurant (Restaurants): The restaurant object to associate the comment with.
        content (str): The content of the comment.
        rate (float): The rate of the comment.
        anonymity (bool): Whether the comment is anonymous.

    Returns:
        The comment object, or 400 if the comment is too long.
    """
    if len(content) > 1000:
        return 400

    return models.Comments.create_comment(
        user_id=user.user_id,
        restaurant_id=restaurant.restaurant_id,
        content=content,
        rate=rate,
        date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        anonymity=anonymity,
    )


############################################################


def delete_comment_v1(comment: models.Comments) -> None:
    """Deletes the given comment. Also deletes all replies associated with the comment.

    Args:
        comment (Comments): The comment object to delete.
    """
    replies: list[models.Replies] = models.Replies.get_replies_by_comment_id(
        comment.comment_id
    )
    for reply in replies:
        models.Replies.delete_reply(reply.reply_id)
    models.Comments.delete_comment(comment.comment_id)


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
