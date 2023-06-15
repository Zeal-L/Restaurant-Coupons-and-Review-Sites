create table Users (
    user_id Serial primary key,
    name Text not null,
    gender Text not null,
    email Text not null,
    password_hash Text not null
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