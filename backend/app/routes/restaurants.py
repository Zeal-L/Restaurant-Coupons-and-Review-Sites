from app import models, services

from flask_jwt_extended import current_user, jwt_required
from flask_restx import Namespace, Resource, fields

api = Namespace("restaurants", description="Restaurants related operations")


############################################################
# Models

new_restaurant_model = api.model(
    "New_Restaurant",
    {
        "name": fields.String(required=True, description="Restaurant name"),
        "address": fields.String(required=True, description="Restaurant address"),
        "image": fields.String(required=True, description="Restaurant image in base64"),
    },
)

restaurant_info_model = api.model(
    "Restaurant_Info",
    {
        "restaurant_id": fields.Integer(required=True, description="Restaurant ID"),
        "owner_id": fields.Integer(required=True, description="Restaurant owner ID"),
        "name": fields.String(required=True, description="Restaurant name"),
        "address": fields.String(required=True, description="Restaurant address"),
        "image": fields.String(required=True, description="Restaurant image in base64"),
        "rating": fields.Float(required=True, description="Restaurant rating"),
        "comment_count": fields.Integer(
            required=True, description="Restaurant comment count"
        ),
    },
)

image_model = api.model(
    "Image",
    {
        "base64": fields.String(
            required=True, description="The restaurant image in base64"
        ),
    },
)

get_by_name_model = api.model(
    "Get_Restaurant_List_By_Name",
    {
        "name": fields.String(required=True, description="Restaurant name"),
        "start": fields.Integer(required=True, description="Start index"),
        "end": fields.Integer(required=True, description="End index"),
    },
)

get_by_rating_model = api.model(
    "Get_Restaurant_List_By_Rating",
    {
        "ascending_order": fields.Boolean(required=True, description="Ascending order"),
        "start": fields.Integer(required=True, description="Start index"),
        "end": fields.Integer(required=True, description="End index"),
    },
)

restaurant_info_list_model = api.model(
    "Restaurant_Info_List",
    {
        "Restaurants": fields.List(
            fields.Nested(restaurant_info_model),
            required=True,
            description="List of restaurants",
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
@api.response(400, "Invalid photo format, must be base64")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(403, "User already has a restaurant")
class NewRestaurant(Resource):
    @api.doc("new_restaurant", body=new_restaurant_model)
    @jwt_required()
    def post(self) -> tuple[dict, int]:
        """Create a new restaurant associated with the current user.

        Returns:
            A tuple containing a dictionary with a message indicating whether the creation was successful and the ID of the new restaurant, and an integer status code.
        """
        info = api.payload

        user: models.Users = current_user

        res = services.restaurants.new_restaurant_v1(
            user, info["name"], info["address"], info["image"]
        )

        if res == 400:
            return {"message": "Invalid photo format, must be base64"}, 400
        elif res == 403:
            return {"message": "User already has a restaurant"}, 403

        res: models.Restaurants = res

        return {"message": "Success", "restaurant_id": res.restaurant_id}, 200


############################################################


@api.route("/delete")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(404, "User does not own the restaurant")
class DeleteRestaurant(Resource):
    @api.doc("delete_restaurant")
    @jwt_required()
    def delete(self) -> tuple[dict, int]:
        """Delete the restaurant associated with the current user.
        Also deletes all comments, replies, dishes, vouchers, voucherTemplates,
        and vouchersAutoReleaseTimers associated with the restaurant.

        Returns:
            A tuple containing a dictionary with a message indicating whether the deletion was successful, and an integer status code.
        """
        user: models.Users = current_user

        res = services.restaurants.delete_restaurant_v1(user)

        if res == 404:
            return {"message": "User does not own the restaurant"}, 404

        return {"message": "Success"}, 200


############################################################


@api.route("/get/by_id/<int:restaurant_id>")
@api.param("restaurant_id", "The ID of the restaurant", type="int", required=True)
@api.response(200, "Success", model=restaurant_info_model)
@api.response(404, "Restaurant not found")
class GetRestaurantByID(Resource):
    @api.doc("get_restaurant_by_id", model="Restaurant_Info")
    @api.marshal_with(restaurant_info_model)
    def get(self, restaurant_id: int) -> tuple[dict, int]:
        """Get restaurant details by ID.

        Args:
            restaurant_id: The ID of the restaurant to retrieve.

        Returns:
            A tuple containing a dictionary with the restaurant's name, address, and image if found, and an integer status code.
            If the restaurant is not found, returns a dictionary with a message indicating the restaurant was not found, and an integer status code.
        """
        if restaurant := models.Restaurants.query.get(restaurant_id):
            rating_info = services.restaurants.get_restaurant_rating_by_id_v1(
                restaurant_id
            )

            return restaurant.__dict__ | rating_info, 200
        else:
            return {"message": "Restaurant not found"}, 404


############################################################


@api.route("/get/by_token")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(404, "User does not own the restaurant")
class GetRestaurantByToken(Resource):
    @api.doc("get_restaurant_by_token", model="Restaurant_Info")
    @api.marshal_with(restaurant_info_model)
    @jwt_required()
    def get(self) -> tuple[dict, int]:
        """Get restaurant details by JWT token.

        Returns:
            A tuple containing a dictionary with the restaurant's name, address, and image if found, and an integer status code.
            If the restaurant is not found, returns a dictionary with a message indicating the restaurant was not found, and an integer status code.
        """
        user: models.Users = current_user

        if restaurant := models.Restaurants.get_restaurant_by_owner(user.user_id):
            rating_info = services.restaurants.get_restaurant_rating_by_id_v1(
                restaurant.restaurant_id
            )

            return restaurant.__dict__ | rating_info, 200
        else:
            return {"message": "User does not own the restaurant"}, 404


############################################################


@api.route("/get/list/by_name")
@api.response(200, "Success", model=restaurant_info_list_model)
@api.response(403, "Invalid start and end index")
class GetRestaurantListByName(Resource):
    @api.doc("get_restaurant_list_by_name", body=get_by_name_model)
    @api.marshal_with(restaurant_info_list_model)
    def post(self) -> tuple[dict, int]:
        """
        Get a list of restaurants by name.

        Returns:
            A tuple containing a dictionary with a list of restaurants sorted by rating, and an integer status code.
            If the start and end indices are invalid, returns a dictionary with a message indicating the indices are invalid, and an integer status code.
        """
        info = api.payload

        start = info["start"]
        end = info["end"]

        if restaurant_list := models.Restaurants.query.filter(
            models.Restaurants.name.ilike(f"%{info['name']}%")
        ).all():
            restaurant_info_list = []
            for restaurant in restaurant_list:
                rating_info = services.restaurants.get_restaurant_rating_by_id_v1(
                    restaurant.restaurant_id
                )
                restaurant_info_list.append(restaurant.__dict__ | rating_info)

            if start < 0 or start > len(restaurant_info_list) or end < 1 or end < start:
                return {"message": "Invalid start and end index"}, 403

            end = min(end, len(restaurant_info_list))

            return {"Restaurants": restaurant_info_list[start:end]}, 200


############################################################


@api.route("/get/list/by_rating")
@api.response(200, "Success", model=restaurant_info_list_model)
@api.response(403, "Invalid start and end index")
class GetRestaurantListByRating(Resource):
    @api.doc(
        "get_restaurant_list_by_rating",
        body=get_by_rating_model,
    )
    @api.marshal_with(restaurant_info_list_model)
    def post(self) -> tuple[dict, int]:
        """Get a list of restaurants by rating.

        Returns:
            A tuple containing a dictionary with a list of restaurants sorted by rating, and an integer status code.
        """
        info = api.payload

        ascending_order: bool = info["ascending_order"]
        start = info["start"]
        end = info["end"]

        # get all restaurant and rating
        restaurant_list = models.Restaurants.query.all()
        restaurant_info_list = []
        for restaurant in restaurant_list:
            rating_info = services.restaurants.get_restaurant_rating_by_id_v1(
                restaurant.restaurant_id
            )
            restaurant_info_list.append(restaurant.__dict__ | rating_info)

        # sort by rating
        restaurant_info_list.sort(
            key=lambda restaurant: restaurant["rating"], reverse=ascending_order
        )

        if start < 0 or start > len(restaurant_info_list) or end < 1 or end < start:
            return {"message": "Invalid start and end index"}, 403

        end = min(end, len(restaurant_info_list))

        return {"Restaurants": restaurant_info_list[start:end]}, 200


############################################################


@api.route("/get/list/by_favorite")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success", model=restaurant_info_list_model)
@api.response(403, "Invalid start and end index")
class GetRestaurantListByFavorite(Resource):
    @api.doc(
        "get_restaurant_list_by_favorite",
    )
    @jwt_required()
    @api.marshal_with(restaurant_info_list_model)
    def post(self) -> tuple[dict, int]:
        user: models.Users = current_user

        # get all restaurant and rating
        restaurant_info_list = []
        for f_id in user.favorite_restaurants:
            restaurant = models.Restaurants.query.get(f_id)
            rating_info = services.restaurants.get_restaurant_rating_by_id_v1(
                restaurant.restaurant_id
            )
            restaurant_info_list.append(restaurant.__dict__ | rating_info)

        return {"Restaurants": restaurant_info_list}, 200


############################################################


@api.route("/reset/name/<string:name>")
@api.param("name", "The new name of the restaurant", type="string", required=True)
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(404, "User does not own the restaurant")
class ResetName(Resource):
    @api.doc("reset_name")
    @jwt_required()
    def put(self, name: str) -> tuple[dict, int]:
        """Reset the name of the restaurant.

        Returns:
            A tuple containing a dictionary with the restaurant's name, address, and image if found, and an integer status code.
        """

        user: models.Users = current_user

        if restaurant := models.Restaurants.get_restaurant_by_owner(user.user_id):
            restaurant.set_name(name)
            return {"message": "Success"}, 200
        else:
            return {"message": "User does not own the restaurant"}, 404


############################################################


@api.route("/reset/address/<string:address>")
@api.param("address", "The new address of the restaurant", type="string", required=True)
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(404, "User does not own the restaurant")
class ResetAddress(Resource):
    @api.doc("reset_address")
    @jwt_required()
    def put(self, address: str) -> tuple[dict, int]:
        """Reset the address of the restaurant.

        Returns:
            A tuple containing a dictionary with the restaurant's name, address, and image if found, and an integer status code.
        """

        user: models.Users = current_user

        if restaurant := models.Restaurants.get_restaurant_by_owner(user.user_id):
            restaurant.set_address(address)
            return {"message": "Success"}, 200
        else:
            return {"message": "User does not own the restaurant"}, 404


############################################################


@api.route("/reset/image")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(400, "Invalid photo format, must be base64")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(404, "User does not own the restaurant")
class ResetImage(Resource):
    @api.doc("reset_image", body=image_model)
    @jwt_required()
    def put(self) -> tuple[dict, int]:
        """Reset the image of the restaurant.

        Returns:
            A tuple containing a dictionary with the restaurant's name, address, and image if found, and an integer status code.
        """

        user: models.Users = current_user

        new_image = api.payload.get("base64")

        if restaurant := models.Restaurants.get_restaurant_by_owner(user.user_id):
            if not services.util.check_photo_format_v1(new_image):
                return {"message": "Invalid photo format, must be base64"}, 400
            restaurant.set_image(new_image)
            return {"message": "Success"}, 200
        else:
            return {"message": "User does not own the restaurant"}, 404


############################################################
