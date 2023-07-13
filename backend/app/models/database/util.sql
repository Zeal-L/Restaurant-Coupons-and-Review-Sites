-- 返回指定餐厅的所有评论id
-- SELECT * FROM get_restaurant_comments([指定餐厅的ID]);
CREATE OR REPLACE FUNCTION get_restaurant_comments(restaurant_id INTEGER) RETURNS TABLE (comment_id INTEGER) AS $$ BEGIN RETURN QUERY
SELECT c.comment_id
FROM Comments c
    JOIN Users u ON c.user_id = u.user_id
WHERE c.restaurant_id = restaurant_id;
END;
$$ LANGUAGE plpgsql;
-- 返回指定评论的所有回复id
-- SELECT * FROM get_comment_replies([指定评论的ID]);
CREATE OR REPLACE FUNCTION get_comment_replies(comment_id INTEGER) RETURNS TABLE (reply_id INTEGER) AS $$ BEGIN RETURN QUERY
SELECT r.reply_id
FROM Replies r
WHERE r.comment_id = comment_id;
END;
$$ LANGUAGE plpgsql;
-- 返回指定餐厅的餐品id
-- SELECT * FROM get_restaurant_dishes([指定餐厅的ID]);
CREATE OR REPLACE FUNCTION get_restaurant_dishes(restaurant_id INTEGER) RETURNS TABLE (dish_id INTEGER) AS $$ BEGIN RETURN QUERY
SELECT dish_id
FROM Dishes
WHERE restaurant_id = restaurant_id;
END;
$$ LANGUAGE plpgsql;


-- 返回指定餐厅的所有优惠券id
-- SELECT * FROM get_restaurant_coupons([指定餐厅的ID]);
CREATE OR REPLACE FUNCTION get_restaurant_coupons(restaurant_id INTEGER) RETURNS TABLE (coupon_id INTEGER) AS $$ BEGIN RETURN QUERY
SELECT c.coupon_id
FROM Coupons c
    JOIN Users u ON c.owner_id = u.user_id
WHERE c.restaurant_id = restaurant_id;
END;
$$ LANGUAGE plpgsql;
-- 返回指定用户的所有优惠券
-- SELECT * FROM get_user_coupons([指定用户的ID]);
CREATE OR REPLACE FUNCTION get_user_coupons(user_id INTEGER) RETURNS TABLE (coupon_id INTEGER) AS $$ BEGIN RETURN QUERY
SELECT c.coupon_id
FROM Coupons c
    JOIN Restaurants r ON c.restaurant_id = r.restaurant_id
WHERE c.owner_id = user_id;
END;
$$ LANGUAGE plpgsql;
-- 返回指定餐厅的所有优惠券发布定时器id
-- SELECT * FROM get_restaurant_coupons_release_timers([指定餐厅的ID]);
CREATE OR REPLACE FUNCTION get_restaurant_coupons_release_timers(restaurant_id INTEGER) RETURNS TABLE (timer_id INTEGER) AS $$ BEGIN RETURN QUERY
SELECT rt.timer_id
FROM CouponsReleaseTimer rt
WHERE rt.restaurant_id = restaurant_id;
END;
$$ LANGUAGE plpgsql;