CREATE TABLE daystable(
id serial not null primary key,
weekdays text not null

);
CREATE TABLE waiter(
id serial not null primary key,   
waiter_name text not null

);
CREATE TABLE roster(
 id serial not null primary key,  
 weekday_id int,
 waiter_id int,
foreign key ( weekday_id ) references daystable(id),
foreign key ( waiter_id ) references waiter(id)
)
