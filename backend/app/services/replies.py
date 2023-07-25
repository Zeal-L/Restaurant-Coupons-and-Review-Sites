from datetime import datetime
from app import models, services

############################################################


def new_reply_v1(
    user_id: int, comment_id: int, content: str, anonymity: bool
) -> int or models.Replies:
    """
    Creates a new reply object and saves it to the database.

    Args:
        user_id (int): The ID of the user creating the reply.
        comment_id (int): The ID of the comment the reply is associated with.
        content (str): The content of the reply.
        anonymity (bool): Whether the reply is anonymous or not.

    Returns:
        int: The ID of the newly created reply object.
        400: If the length of the content is greater than 1000 characters.
    """

    if len(content) > 1000:
        return 400

    return models.Replies.create_reply(
        user_id=user_id,
        comment_id=comment_id,
        content=content,
        date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        anonymity=anonymity,
    )


############################################################


def delete_all_replies_by_comment_v1(comment: models.Comments) -> None:
    """Deletes all replies associated with the given comment.

    Args:
        comment (Comments): The comment object to delete replies for.
    """
    replies: list[models.Replies] = models.Replies.get_replies_by_comment_id(
        comment.comment_id
    )

    for reply in replies:
        models.Replies.delete_reply(reply.reply_id)
