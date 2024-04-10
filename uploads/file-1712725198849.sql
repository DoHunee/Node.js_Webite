# 동일한 스키마가 있다면 삭제
drop database test;
# 스키마 생성
CREATE database test;
show databases;

# 사용자 생성 및 권한 추가
DROP USER 'test'@'localhost';
CREATE USER 'test'@'localhost' identified with mysql_native_password by 'test';
GRANT ALL PRIVILEGES ON test.* TO 'test'@'localhost';
flush privileges;

use test;
show tables;
drop table user;
drop table contact;


# 테이블 생성
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userid` VARCHAR(50) NULL,
  `username` VARCHAR(50) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `contact`(
`idx` INT NOT NULL AUTO_INCREMENT,
`name` VARCHAR(45) NULL,
`phone` VARCHAR(45) NULL, 
`email` VARCHAR(45) NULL, 
`memo` TEXT NULL, 
`regdate` VARCHAR(20) NULL, 
PRIMARY KEY(`idx`));

CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# 테스트 데이터 입력
insert into test.user(userid, username) values ('codegear', '코드기어');
insert into test.user(userid, username) values ('ironman', '아이언맨');
insert into test.user(userid, username) values ('spiderman', '스파이더맨');

insert into test.contact(idx, name,phone,email,memo,regdate) values ('1', '장도훈', '010-5526-1387', 'j981104@naver.com', '배가 고프네요~' , '이건 뭐징?');
insert into test.contact(idx, name,phone,email,memo,regdate) values ('2', '권영주', '010-4574-1387', 'dudwn@naver.com', '배가 부르네요~' , '이건 뭐징?');
insert into test.contact(idx, name,phone,email,memo,regdate) values ('3', '이하민', '010-8520-1387', 'gkals@naver.com', '술이 고프네요~' , '이건 뭐징?');


select * from user;
select * from contact;
select * from 






