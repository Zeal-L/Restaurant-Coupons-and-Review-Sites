from app import models, services


from flask_jwt_extended import current_user, jwt_required
from flask_restx import Namespace, Resource, fields

api = Namespace("comments", description="Comments related operations")

############################################################
# Models

new_comment_model = api.model(
    "New_Comment",
    {
        "restaurant_id": fields.Integer(
            required=True,
            description="The ID of the restaurant to which the comment is related.",
        ),
        "content": fields.String(
            required=True, description="The content of the comment."
        ),
        "rate": fields.Float(required=True, description="The rate of the comment."),
        "anonymity": fields.Boolean(
            required=True, description="Whether the comment is anonymous."
        ),
    },
)

comment_info_model = api.model(
    "Comment_Info",
    {
        "comment_id": fields.Integer(
            required=True, description="The ID of the comment."
        ),
        "user_id": fields.Integer(
            required=True, description="The ID of the user who wrote the comment."
        ),
        "restaurant_id": fields.Integer(
            required=True,
            description="The ID of the restaurant to which the comment is related.",
        ),
        "content": fields.String(
            required=True, description="The content of the comment."
        ),
        "rate": fields.Float(required=True, description="The rate of the comment."),
        "date": fields.String(required=True, description="The date of the comment."),
        "anonymity": fields.Boolean(
            required=True, description="Whether the comment is anonymous."
        ),
        "liked_by": fields.Boolean(
            required=True,
            description="Whether the current user liked the comment.",
        ),
        "disliked_by": fields.Boolean(
            required=True,
            description="Whether the current user disliked the comment.",
        ),
    },
)

comment_list_model = api.model(
    "Comment_List",
    {
        "message": fields.String(
            required=True,
            description="A message indicating whether the operation was successful.",
        ),
        "comment_ids": fields.List(
            fields.Integer(), required=True, description="The IDs of the comments."
        ),
    },
)

by_restaurant_model = api.model(
    "By_Restaurant",
    {
        "restaurant_id": fields.Integer(
            required=True, description="The ID of the restaurant to get comments for."
        ),
        "start": fields.Integer(
            required=True, description="The starting index of the comments to get."
        ),
        "end": fields.Integer(
            required=True, description="The ending index of the comments to get."
        ),
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
@api.response(400, "Invalid comment length, must be less than 1000 characters")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(403, "Invalid rate range")
@api.response(404, "Restaurant not found")
class NewComment(Resource):
    @api.doc("new_comment", body=new_comment_model)
    @jwt_required()
    def post(self) -> tuple[dict, int]:
        """Create a new comment associated with the current user and a restaurant.

        Returns:
            A tuple containing a dictionary with a message indicating whether the creation was successful and the ID of the new comment, and an integer status code.
        """
        info = api.payload

        user: models.Users = current_user

        restaurant = models.Restaurants.query.get(info["restaurant_id"])
        if not restaurant:
            return {"message": "Restaurant not found"}, 404

        res = services.comments.new_comment_v1(
            user, restaurant, info["content"], info["rate"], info["anonymity"]
        )

        if res == 400:
            return {"message": "Invalid comment format"}, 400
        elif res == 403:
            return {"message": "Invalid rate range"}, 403

        res: models.Comments = res

        return {"message": "Success", "comment_id": res.comment_id}, 200


############################################################


@api.route("/delete/<int:comment_id>")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized, invalid JWT token or not the owner of the comment")
@api.response(404, "Comment not found")
class DeleteComment(Resource):
    @jwt_required()
    def delete(self, comment_id: int) -> tuple[dict, int]:
        """Delete a comment associated with the current user. It also deletes all replies associated with the comment.

        Args:
            comment_id: The ID of the comment to delete.

        Returns:
            A tuple containing a dictionary with a message indicating whether the deletion was successful, and an integer status code.
        """
        user: models.Users = current_user

        comment = models.Comments.query.get(comment_id)
        if not comment:
            return {"message": "Comment not found"}, 404

        if comment.user_id != user.user_id:
            return {"message": "Unauthorized, not the owner of the comment"}, 401

        services.comments.delete_comment_v1(comment)

        return {"message": "Success"}, 200


############################################################


@api.route("/get/by_id/<int:comment_id>")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=False,
    _in="header",
)
@api.param("comment_id", "The ID of the comment to get", type="integer", required=True)
@api.response(200, "Success", body=comment_info_model)
@api.response(404, "Comment not found")
class GetComment(Resource):
    @api.doc("get_comment", model="Comment_Info")
    @jwt_required(optional=True)
    @api.marshal_with(comment_info_model)
    def get(self, comment_id: int) -> tuple[dict, int]:
        """Get a single comment by its ID.

        Args:
            comment_id: The ID of the comment to get.

        Returns:
            A tuple containing a dictionary representing the comment, or a dictionary with an error message and an integer status code.
        """
        user: models.Users = current_user

        if not (comment := models.Comments.query.get(comment_id)):
            return {"message": "Comment not found"}, 404
        liked_by = False
        disliked_by = False
        if user:
            if comment.liked_by is not None:
                liked_by = user.user_id in comment.liked_by
            if comment.disliked_by is not None:
                disliked_by = user.user_id in comment.disliked_by

        return {
            "comment_id": comment.comment_id,
            "user_id": comment.user_id,
            "restaurant_id": comment.restaurant_id,
            "content": comment.content,
            "rate": comment.rate,
            "date": comment.date,
            "anonymity": comment.anonymity,
            "liked_by": liked_by,
            "disliked_by": disliked_by,
        }, 200


############################################################


@api.route("/get/count/by_restaurant/<int:restaurant_id>")
@api.param(
    "restaurant_id",
    "The ID of the restaurant to get comments for",
    type="integer",
    required=True,
)
@api.response(200, "Success")
@api.response(404, "Restaurant not found")
class GetCommentsCountByRestaurant(Resource):
    @api.doc("get_comments_count_by_restaurant")
    def get(self, restaurant_id: int) -> tuple[dict, int]:
        if not models.Restaurants.query.get(restaurant_id):
            return {"message": "Restaurant not found"}, 404

        comments_count = models.Comments.query.filter_by(
            restaurant_id=restaurant_id
        ).count()

        return {"message": "Success", "count": comments_count}, 200


############################################################


@api.route("/get/by_restaurant")
@api.response(200, "Success", body=comment_list_model)
@api.response(400, "Invalid start or end value")
@api.response(404, "Restaurant not found")
class GetCommentsByRestaurant(Resource):
    @api.doc(
        "get_comments_by_restaurant", model="Comment_List", body=by_restaurant_model
    )
    def get(self) -> tuple[dict, int]:
        """Get a list of comment IDs for a given restaurant, with optional start and end indices.

        Returns:
            A tuple containing a dictionary with a message and a list of comment IDs, or a dictionary with an error message and an integer status code.
        """

        info = api.payload

        if not models.Restaurants.query.get(info["restaurant_id"]):
            return {"message": "Restaurant not found"}, 404

        comments = (
            models.Comments.query.filter_by(restaurant_id=info["restaurant_id"])
            .order_by(models.Comments.comment_id)
            .all()
        )

        start = info["start"]
        end = info["end"]

        if start < 0 or end < 1 or start >= end or end > len(comments):
            return {"message": "Invalid start or end value"}, 400

        comment_ids = [comment.comment_id for comment in comments[start:end]]

        return {"message": "Success", "comment_ids": comment_ids}, 200


############################################################


@api.route("/report/<int:comment_id>")
@api.param(
    "comment_id",
    "The ID of the comment to report",
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
@api.response(400, "User already reported the comment")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(403, "User cannot report their own comment")
@api.response(404, "Comment not found")
class ReportComment(Resource):
    @api.doc("report_comment")
    @jwt_required()
    def post(self, comment_id: int) -> tuple[dict, int]:
        """Report a comment. If the comment has been reported 5 or more times, it will be deleted.

        Args:
            comment_id: The ID of the comment to report.

        Returns:
            A tuple containing a dictionary with a success message or an error message and an integer status code.
        """
        user: models.Users = current_user

        comment: models.Comments = models.Comments.query.get(comment_id)

        if comment is None:
            return {"message": "Comment not found"}, 404

        if comment.user_id == user.user_id:
            return {"message": "User cannot report their own comment"}, 403

        if not comment.add_report_by(user.user_id):
            return {"message": "User already reported the comment"}, 400

        if comment.get_report_num() >= 5:
            services.comments.delete_comment_v1(comment)

        return {"message": "Success"}, 200


############################################################


@api.route("/liked_by/add/<int:comment_id>")
@api.param(
    "comment_id",
    "The ID of the comment to add liked by user",
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
@api.response(400, "User already liked the comment")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(403, "User cannot like their own comment")
@api.response(404, "Comment not found")
class AddLikedBy(Resource):
    @api.doc("add_liked_by")
    @jwt_required()
    def post(self, comment_id: int) -> tuple[dict, int]:
        """Add a user to the liked by list of a comment.
        It also removes the user from the disliked by list if they are in it.

        Args:
            comment_id: The ID of the comment to add liked by user.

        Returns:
            A tuple containing a dictionary with a success message or an error message and an integer status code.
        """
        user: models.Users = current_user

        comment: models.Comments = models.Comments.query.get(comment_id)

        if comment is None:
            return {"message": "Comment not found"}, 404

        if comment.user_id == user.user_id:
            return {"message": "User cannot like their own comment"}, 403

        if not comment.add_liked_by(user.user_id):
            return {"message": "User already liked the comment"}, 400

        return {"message": "Success"}, 200


############################################################


@api.route("/liked_by/remove/<int:comment_id>")
@api.param(
    "comment_id",
    "The ID of the comment to remove liked by user",
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
@api.response(400, "User did not like the comment")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(404, "Comment not found")
class RemoveLikedBy(Resource):
    @api.doc("remove_liked_by")
    @jwt_required()
    def delete(self, comment_id: int) -> tuple[dict, int]:
        """Remove a user from the liked by list of a comment.

        Args:
            comment_id: The ID of the comment to remove liked by user.

        Returns:
            A tuple containing a dictionary with a success message or an error message and an integer status code.
        """
        user: models.Users = current_user

        comment: models.Comments = models.Comments.query.get(comment_id)

        if comment is None:
            return {"message": "Comment not found"}, 404

        if not comment.remove_liked_by(user.user_id):
            return {"message": "User did not like the comment"}, 400

        return {"message": "Success"}, 200


############################################################


@api.route("/disliked_by/add/<int:comment_id>")
@api.param(
    "comment_id",
    "The ID of the comment to add disliked by user",
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
@api.response(400, "User already disliked the comment")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(403, "User cannot dislike their own comment")
@api.response(404, "Comment not found")
class AddDislikedBy(Resource):
    @api.doc("add_disliked_by")
    @jwt_required()
    def post(self, comment_id: int) -> tuple[dict, int]:
        """Add a user to the disliked by list of a comment.
        It also removes the user from the liked by list if they are in it.

        Args:
            comment_id: The ID of the comment to add disliked by user.

        Returns:
            A tuple containing a dictionary with a success message or an error message and an integer status code.
        """
        user: models.Users = current_user

        comment: models.Comments = models.Comments.query.get(comment_id)

        if comment is None:
            return {"message": "Comment not found"}, 404

        if comment.user_id == user.user_id:
            return {"message": "User cannot dislike their own comment"}, 403

        if not comment.add_disliked_by(user.user_id):
            return {"message": "User already disliked the comment"}, 400

        return {"message": "Success"}, 200


############################################################


@api.route("/disliked_by/remove/<int:comment_id>")
@api.param(
    "comment_id",
    "The ID of the comment to remove disliked by user",
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
@api.response(400, "User did not dislike the comment")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(404, "Comment not found")
class RemoveDislikedBy(Resource):
    @api.doc("remove_disliked_by")
    @jwt_required()
    def delete(self, comment_id: int) -> tuple[dict, int]:
        """Remove a user from the disliked by list of a comment.

        Args:
            comment_id: The ID of the comment to remove disliked by user.

        Returns:
            A tuple containing a dictionary with a success message or an error message and an integer status code.
        """
        user: models.Users = current_user

        comment: models.Comments = models.Comments.query.get(comment_id)

        if comment is None:
            return {"message": "Comment not found"}, 404

        if not comment.remove_disliked_by(user.user_id):
            return {"message": "User did not dislike the comment"}, 400

        return {"message": "Success"}, 200
