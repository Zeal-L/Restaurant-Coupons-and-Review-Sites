from app import models, services

############################################################


def delete_all_replies_by_comment_v1(comment: models.Comments) -> None:
    """Deletes all replies associated with the given comment.

    Args:
        comment (Comments): The comment object to delete replies for.
    """
    replies: list[models.Replies] = models.Replies.get_replies_by_comment(
        comment.comment_id
    )

    for reply in replies:
        models.Replies.delete_reply(reply.reply_id)
