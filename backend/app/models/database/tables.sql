create table UnconfirmedUsers (
    user_id Serial primary key,
    name Text not null,
    email Text not null,
    password_hash Text not null,
    confirm_code Text
);
create table Users (
    user_id Serial primary key,
    name Text not null,
    email Text not null,
    email_reset_code Text,
    password_hash Text not null,
    password_reset_code Text,
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
    anonymity Boolean not null,
    report_by Integer [],
    liked_by Integer [],
    disliked_by Integer []
);
create table Replies (
    reply_id Serial primary key,
    user_id Serial not null references Users(user_id),
    comment_id Serial not null references Comments(comment_id),
    content Text not null,
    date Date not null,
    anonymity Boolean not null
    report_by Integer [],
);
create table VoucherTemplate (
    template_id Serial primary key,
    restaurant_id Serial not null references Restaurants(restaurant_id),
    type Text not null,
    discount Text not null,
    condition Text not null,
    description Text not null,
    expire Float not null,
    shareable Boolean not null,
    remain_amount Integer not null,
    total_amount Integer not null
);
create table Vouchers (
    voucher_id Serial primary key,
    template_id Serial not null references VoucherTemplate(template_id),
    owner_id Serial not null references Users(user_id),
    is_used Boolean not null,
    used_time Float,
    code Text,
    code_time Float
);
create table VouchersAutoReleaseTimer (
    timer_id Serial primary key,
    restaurant_id Serial not null references Restaurants(restaurant_id),
    template_id Serial not null references VoucherTemplate(template_id),
    amount Integer not null,
    start_date Float not null,
    end_date Float not null,
    interval Integer not null
);