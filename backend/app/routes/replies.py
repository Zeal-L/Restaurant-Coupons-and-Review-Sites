from app import models, services

from flask_jwt_extended import current_user, jwt_required
from flask_restx import Namespace, Resource, fields

api = Namespace("replies", description="Replies related operations")

############################################################
# Models

new_reply_model = api.model(
    "New_Reply",
    {
        "comment_id": fields.Integer(required=True, description="Comment ID"),
        "content": fields.String(required=True, description="Reply content"),
        "anonymity": fields.Boolean(required=True, description="Reply anonymity"),
    },
)

repry_info_model = api.model(
    "Reply_Info",
    {
        "reply_id": fields.Integer(required=True, description="Reply ID"),
        "user_id": fields.Integer(required=True, description="Reply user ID"),
        "comment_id": fields.Integer(required=True, description="Reply comment ID"),
        "content": fields.String(required=True, description="Reply content"),
        "date": fields.String(required=True, description="Reply date"),
        "anonymity": fields.Boolean(required=True, description="Reply anonymity"),
        "report_by": fields.List(
            fields.Integer(),
            required=True,
            description="The IDs of the users who reported the reply.",
        ),
    },
)

reply_list_model = api.model(
    "Reply_List",
    {
        "message": fields.String(required=True, description="Reply list message"),
        "reply_ids": fields.List(
            fields.Integer(), required=True, description="List of reply IDs"
        ),
    },
)

by_comment_model = api.model(
    "By_Comment",
    {
        "comment_id": fields.Integer(required=True, description="Comment ID"),
        "start": fields.Integer(required=True, description="Start index"),
        "end": fields.Integer(required=True, description="End index"),
    },
)


############################################################


@api.route("/new")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(400, "Invalid reply length, must be less than 1000 characters")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(404, "Comment not found")
class NewReply(Resource):
    @api.doc("new_reply", body=new_reply_model)
    @jwt_required()
    def post(self) -> tuple[dict, int]:
        """Create a new reply associated with the current user and a comment.

        Returns:
            A tuple containing a dictionary with a message indicating whether the creation was successful and the ID of the new reply, and an integer status code.
        """
        info = api.payload

        user: models.Users = current_user

        comment: models.Comments = models.Comments.query.get(info["comment_id"])
        if not comment:
            return {"message": "Comment not found"}, 404

        res = services.replies.new_reply_v1(
            user.user_id, comment.comment_id, info["content"], info["anonymity"]
        )

        if res == 400:
            return {
                "message": "Invalid reply length, must be less than 1000 characters"
            }, 400

        res: models.Replies = res

        return {"message": "Success", "reply_id": res.reply_id}, 200


############################################################


@api.route("/delete/<int:reply_id>")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized, invalid JWT token or not the owner of the reply")
@api.response(404, "Reply not found")
class DeleteReply(Resource):
    @jwt_required()
    def delete(self, reply_id: int) -> tuple[dict, int]:
        """Delete a reply associated with the current user.

        Args:
            reply_id: The ID of the reply to delete.

        Returns:
            A tuple containing a dictionary with a message indicating whether the deletion was successful, and an integer status code.
        """
        user: models.Users = current_user

        reply = models.Replies.query.get(reply_id)
        if not reply:
            return {"message": "Reply not found"}, 404

        if reply.user_id != user.user_id:
            return {"message": "Unauthorized, not the owner of the reply"}, 401

        models.Replies.delete_reply(reply_id)

        return {"message": "Success"}, 200


############################################################


@api.route("/get/by_id/<int:reply_id>")
@api.param("reply_id", "The ID of the reply info to get", type="integer", required=True)
@api.response(200, "Success", body=repry_info_model)
@api.response(404, "Reply not found")
class GetReply(Resource):
    @api.doc("get_reply", model="Reply_Info")
    @api.marshal_with(repry_info_model)
    def get(self, reply_id: int) -> tuple[dict, int]:
        """
        Get reply information by ID.

        Args:
            reply_id: The ID of the reply to get.

        Returns:
            A tuple containing a dictionary with the reply information and an integer status code.
        """

        if reply := models.Replies.query.get(reply_id):
            return reply, 200
        else:
            return {"message": "Reply not found"}, 404


############################################################


@api.route("/get/count/by_comment/<int:comment_id>")
@api.param(
    "comment_id",
    "The ID of the comment to get replies count for",
    type="integer",
    required=True,
)
@api.response(200, "Success")
@api.response(404, "Comment not found")
class GetRepliesCountByComment(Resource):
    @api.doc("get_replies_count_by_comment")
    def get(self, comment_id: int) -> tuple[dict, int]:
        """Get the number of replies for a comment by its ID.

        Args:
            comment_id: The ID of the comment to get replies count for.

        Returns:
            A tuple containing a dictionary with the message and the count of replies, and an integer status code.
        """
        if not models.Comments.query.get(comment_id):
            return {"message": "Comment not found"}, 404

        replies_count = models.Replies.query.filter_by(comment_id=comment_id).count()

        return {"message": "Success", "count": replies_count}, 200


############################################################


@api.route("/get/by_comment")
@api.response(200, "Success", body=reply_list_model)
@api.response(400, "Invalid start or end value")
@api.response(404, "Comment not found")
class GetRepliesByComment(Resource):
    @api.doc("get_replies_by_comment", model="Reply_List", body=by_comment_model)
    def post(self) -> tuple[dict, int]:
        """Get a list of reply IDs for a comment by its ID, with optional start and end indices.

        Returns:
            A tuple containing a dictionary with the message and a list of reply IDs, and an integer status code.
        """
        info = api.payload

        if not models.Comments.query.get(info["comment_id"]):
            return {"message": "Comment not found"}, 404

        replies = (
            models.Replies.query.filter_by(comment_id=info["comment_id"])
            .order_by(models.Replies.reply_id)
            .all()
        )

        start = info["start"]
        end = info["end"]

        if start < 0 or end < 1 or start >= end or end > len(replies):
            return {"message": "Invalid start or end value"}, 400

        reply_ids = [reply.reply_id for reply in replies[start:end]]

        return {"message": "Success", "reply_ids": reply_ids}, 200


############################################################


@api.route("/report/<int:reply_id>")
@api.param(
    "reply_id",
    "The ID of the reply to report",
    type="integer",
    required=True,
)
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(400, "User already reported the reply")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(403, "User cannot report their own reply")
@api.response(404, "Reply not found")
class ReportReply(Resource):
    @api.doc("report_reply")
    @jwt_required()
    def post(self, reply_id: int) -> tuple[dict, int]:
        """Report a reply. If the reply has been reported 5 or more times, it will be deleted.

        Args:
            reply_id: The ID of the reply to report.

        Returns:
            A tuple containing a dictionary with a success message or an error message and an integer status code.
        """
        user: models.Users = current_user

        reply: models.Replies = models.Replies.query.get(reply_id)

        if reply is None:
            return {"message": "Reply not found"}, 404

        if reply.user_id == user.user_id:
            return {"message": "User cannot report their own reply"}, 403

        if not reply.add_report_by(user.user_id):
            return {"message": "User already reported the reply"}, 400

        if reply.get_report_num() >= 5:
            models.Replies.delete_reply(reply_id)

        return {"message": "Success"}, 200
