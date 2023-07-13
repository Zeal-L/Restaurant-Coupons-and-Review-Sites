create table Users (
    user_id Serial primary key,
    name Text not null,
    gender Text not null,
    email Text not null,
    password_hash Text not null,
    photo Text,
    token Text,
    saved_restaurants Integer []
);
create table Restaurants (
    restaurant_id Serial primary key,
    owner_id Serial not null references Users(user_id),
    name Text not null,
    address Text not null,
    image Text not null
);
create table Dishes (
    dish_id Serial primary key,
    restaurant_id Serial not null references Restaurants(restaurant_id),
    name Text not null,
    price Float not null,
    description Text not null,
    image Text not null
);
create table Comments (
    comment_id Serial primary key,
    user_id Serial not null references Users(user_id),
    restaurant_id Serial not null references Restaurants(restaurant_id),
    content Text not null,
    rate Float not null,
    date Date not null,
    report_num Integer not null,
    anonymity Boolean not null,
    liked_by Integer [],
    disliked_by Integer []
);
create table Replies (
    reply_id Serial primary key,
    sender_id Serial not null references Users(user_id),
    comment_id Serial not null references Comments(comment_id),
    content Text not null,
    date Date not null,
    report_num Integer not null,
    anonymity Boolean not null
);
create table Voucher_template (
    voucher_id Serial primary key,
    restaurant_id Serial not null references Restaurants(restaurant_id),
    type Text not null,
    discount Text not null,
    condition Text not null,
    description Text not null,
    expire Date not null,
    shareable Boolean not null,
    remain_amount Integer not null,
    total_amount Integer not null
);
create table Vouchers (
    voucher_id Serial primary key,
    voucher_template Serial not null references Voucher_template(voucher_id),
    owner_id Serial not null references Users(user_id),
    is_used Boolean not null,
    used_time Date,
    code Text,
    code_time Date
);
create table VouchersAutoReleaseTimer (
    timer_id Serial primary key,
    restaurant_id Serial not null references Restaurants(restaurant_id),
    voucher_template Serial not null references Voucher_template(voucher_id),
    -- Timer task info
    amount Integer not null,
    start_date Date not null,
    end_date Date not null,
    interval Integer not null
);