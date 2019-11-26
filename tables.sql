CREATE TABLE weekdays(
id serial not null primary key,
weekdays text not null

);
CREATE TABLE waiter(
id serial not null primary key,   
waiter_name text not null,
weekday_id int,
foreign key ( weekday_id ) references weekdays(id)
);
