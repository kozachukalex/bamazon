DROP DATABASE IF EXISTS ice_creamDB;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT(50) NOT NULL,
  stock_quantity INT(50) NOT NULL,
  PRIMARY KEY (id)
);

USE bamazon;
SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Motherboard", "Electronics", 200, 8);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Graphics Card", "Electronics", 250, 17);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pasta Pot", "Kitchen", 20, 14);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dog Food", "Pets", 50, 43);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Chew Toy", "Pets", 8, 48);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Notebook", "School Supplies", 6, 36);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mechanical Pencils", "School Supplies", 4, 84);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bug Spray", "Camping", 6, 73);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Firestart Kit", "Camping", 14, 12);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Knife Set and Block", "Kitchen", 300, 8);
