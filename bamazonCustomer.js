var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
});

//inquirer upon initiating application (purchase, restock, sign out)
function onStart() {
    inquirer.prompt([

        {
            type: "list",
            name: "selection",
            message: "Hello. What would you like to do?",
            choices: ["Purchase Item", "Manage Inventory", "Sign Out"]
        }
    ]).then(function (response) {
        if (response.selection === "Purchase Item") {
            console.log("purchase item");
            beginPurchase();

        }
        else if (response.selection === "Manage Inventory") {
            console.log("Manage Inventory");
            manageInventory();
        }
        else {
            console.log("Goodbye!");
            signOut();
        }
    });
};
function beginPurchase() {
    inquirer.prompt([
        {
            type: "list",
            name: "selection",
            message: "What would you like to see?",
            choices: ["All Products", "Products by department", "Return to main menu"]
        }
    ]).then(function (response) {
        if (response.selection === "All Products") {
            console.log("Selecting all products...\n");
            connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw err;
                console.log(res);
                inquirer.prompt([
                    {
                        type: "input",
                        name: "id",
                        message: "Enter the ID of the item you wish to purchase."
                    },
                    {
                        type: "input",
                        name: "purchaseQuantity",
                        message: "How many would you like to purchase?"
                    }
                ])
                    .then(function (response) {
                        var id = response.id;
                        var purchaseQuantity = parseInt(response.purchaseQuantity);
                        inquirer.prompt([
                            {
                                type: "confirm",
                                name: "confirmation",
                                message: "Would you like to purchase " + purchaseQuantity + " of item ID: " + id + "?"
                            }
                        ]).then(function (response) {
                            console.log(response);
                            if (response.confirmation) {
                                res.forEach(function (product) {
                                    if (product.id == id) {
                                        connection.query("SELECT * FROM products WHERE ?",
                                            [
                                                {
                                                    id: id
                                                }
                                            ], function (err, res) {
                                                if (err) throw err;
                                                if (res[0].stock_quantity > purchaseQuantity) {
                                                    var newStockQty = res[0].stock_quantity - purchaseQuantity;
                                                    connection.query(
                                                        "UPDATE products SET ? WHERE ?",
                                                        [
                                                          {
                                                            stock_quantity: newStockQty
                                                          },
                                                          {
                                                            id: id
                                                          }
                                                        ],
                                                        function(error) {
                                                          if (error) throw err;
                                                          console.log("Item purchased successfully!");
                                                          beginPurchase();
                                                        }
                                                      );
                                                }
                                                else {
                                                    console.log("Insufficient stock. Please try again.");
                                                    beginPurchase();
                                                }
                                            });
                                    }
                                });
                            }
                            else {
                                console.log("Confirmation was denied. Returning to purchasing menu.")
                                beginPurchase();
                            }
                        })
                    })
            }
            )
        };
        if (response.selection === "Products by Department") {
            console.log("This section has not yet been completed.");
            inquirer.prompt([
                {
                    type: "list",
                    name: "selection",
                    message: "Which department would you like to browse?",
                    choices: ["Camping", "Electronics", "Kitchen", "Pets", "School Supplies"]
                }
            ]).then(function (response) {
                var department = response.selection;
                //use read query with param of department to sort the table to proper items
                // log these items to the terminal
            });
        };
        if (response.selection === "Return to main menu") {
            onStart();
        };

    })

}
function manageInventory() {
    inquirer.prompt([
        {
            type: "list",
            name: "selection",
            message: "What would you like to do?",
            choices: ["Add new item", "Upstock stock quantity", "Return to main menu"]
        }
    ])
        .then(function (response) {
            if (response.selection === "Add new item") {
                inquirer.prompt([
                    {
                        type: "input",
                        name: "name",
                        message: "What product would you like to add?"
                    },
                    {
                        type: "input",
                        name: "department",
                        message: "What department is the item in?"
                    },
                    {
                        type: "input",
                        name: "price",
                        message: "What is the price of the item?"
                    },
                    {
                        type: "input",
                        name: "quantity",
                        message: "How many of this item are there?"
                    }
                ]).then(function (response) {
                    var newItem = {
                        name: response.name,
                        department: response.department,
                        price: response.price,
                        quantity: response.quantity
                    }
                    inquirer.prompt([
                        {
                            type: "confirm",
                            name: "selection",
                            message: "Is this information correct?"
                        }
                    ]).then(function (response) {
                        console.log(response.selection);
                        console.log(newItem);
                        if (response.selection === true) {
                            //usen a insert into method to create new item
                            connection.query(
                                "INSERT INTO products SET ?",
                                {
                                    product_name: newItem.name,
                                    department_name: newItem.department,
                                    price: newItem.price,
                                    stock_quantity: newItem.quantity
                                },
                                function (err) {
                                    if (err) throw err;
                                    console.log("Item successfully added.")
                                    manageInventory();
                                }
                            );
                        }
                        else {
                            console.log("Due to wrong information, item was not added.");
                            manageInventory();
                        }
                    });
                });
            }
            if (response.selection === "Upstock stock quantity") {
                updateStockQty();

            }
            if (response.selection === "Return to main menu") {
                onStart();
            }
        });
};

// sign out- exits application
function signOut() {
    connection.end();
}

function updateStockQty() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "Enter the ID of the item you wish to update quantity."
            },
            {
                type: "input",
                name: "newStock",
                message: "How many would you like to add to the inventory?"
            }
        ]).then(function (response) {
            if (err) throw err;
            console.log(res);
            for (i = 0; i < res.length; i++) {
                if (res[i].id == response.id) {
                    var chosenItem = res[i].id
                    var newQuantity = parseInt(res[i].stock_quantity) + parseInt(response.newStock);
                    console.log(chosenItem);
                    console.log(newQuantity);
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newQuantity
                            },
                            {
                                id: chosenItem
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Stock updated successfully to: " + newQuantity);
                            manageInventory();
                        }
                    );
                }
            }
        });
    });
};


//begins application
onStart();
