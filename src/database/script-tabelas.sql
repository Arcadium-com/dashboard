create user 'arcadium'@'localhost' identified by '123';
grant all on *.* to 'arcadium'@'localhost';

create database arcadium;
use arcadium;

create table Usuario(
	id int primary key auto_increment,
	email varchar(100) unique,
	senha varchar(255)
);
