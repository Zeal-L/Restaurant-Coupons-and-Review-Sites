create table Users (
    user_id Serial primary key,
    name Text not null,
    gender Text not null,
    photo Text not null,
    email Text not null,
    password_hash Text not null,
    token Text
);

create table Merchants (
    merchant_id Serial not null references Users(user_id),
    primary key(merchant_id)
);

create table Customers (
    customer_id Serial not null references Users(user_id),
    primary key(customer_id),
    likes Integer[],
    coupon_id Integer[]
);

create table Restaurants (
    restaurant_id Serial primary key,
    name Text not null,
    address Text not null,
    merchant_id Serial not null references Merchants(merchant_id),
    image Text not null,
    longitude Float not null,
    latitude Float not null,
    comments Integer[],
    coupon_id Integer[],
    dishes Integer[]
);

create table Comments (
    comment_id Serial primary key,
    content Text not null,
    rate Float not null,
    date Date not null,
    customer_id Serial not null references Customers(customer_id),
    restaurant_id Serial not null references Restaurants(restaurant_id)
);

create table Coupons (
    coupon_id Serial primary key,
    type Text not null,
    discount Text not null,
    condition Text,
    restaurant_id Serial not null references Restaurants(restaurant_id),
    expire Date not null
);

create table Dishes (
    dish_id Serial primary key,
    name Text not null,
    price Float not null,
    description Text not null,
    image Text,
    restaurant_id Serial not null references Restaurants(restaurant_id)
);


-- INSERT INTO Users (name, gender, photo, email, password_hash)
-- SELECT
--     CONCAT(first_name, ' ', last_name) AS name,
--     CASE WHEN RANDOM() < 0.5 THEN 'male' ELSE 'female' END AS gender,
--     CONCAT('https://randomuser.me/api/portraits/', CASE WHEN RANDOM() < 0.5 THEN 'men/' ELSE 'women/' END, FLOOR(RANDOM() * 99), '.jpg') AS photo,
--     (SELECT CONCAT(REPLACE(CONCAT(first_name, last_name, FLOOR(RANDOM() * 100), FLOOR(RANDOM() * 100))::text, ' ', ''), '@example.com')) AS email,
--     'pbkdf2:sha256:600000$7dnk51qYZiEYws3h$d437d95b82fd519cf1b8ac73885516bfa9ad9eef8fb307fd4341fbd362b67a38' AS password_hash
-- FROM
--     (SELECT first_name FROM (VALUES ('John'), ('Jane'), ('Bob'), ('Alice'), ('David'), ('Mary'), ('Tom'), ('Sara'), ('Peter'), ('Emily')) AS first_names (first_name) ORDER BY RANDOM() LIMIT 1) AS fn,
--     (SELECT last_name FROM (VALUES ('Doe'), ('Smith'), ('Johnson'), ('Williams'), ('Brown'), ('Lee'), ('Wilson'), ('Taylor'), ('Anderson'), ('Clark')) AS last_names (last_name) ORDER BY RANDOM() LIMIT 1) AS ln
-- LIMIT 1;