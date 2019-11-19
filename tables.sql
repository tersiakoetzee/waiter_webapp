CREATE TABLE shifts(
id serial not null primary key,
weekdays text not null,
waiter_working text not null
);
CREATE TABLE waiter(
id serial not null primary key,   
waiter_name text not null,
days_id int,
foreign key (days_id) references shifts(id)
);