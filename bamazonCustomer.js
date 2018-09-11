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

        // After the prompt, store the user's response in a variable called location.
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
// purchase - connection start and print the current stock of the database and new inq to item ID desired, and ask quantity desired
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
            readProducts();
        };
        if (response.selection === "Products by Department") {
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
// check if item is in stock and desired qty- if yes, verify final price- sell and remove from stock (can keep track of total sales per department on backend)
// if no- notify customer, ask how many they would like to purchase again (repeat until qty is allowed)

// restock - similiar, print stock, ask which item they would like to add stock to
function manageInventory() {
    inquirer.prompt([
        {
            type: "list",
            name: "selection",
            message: "What would you like to do?",
            choices: ["Add new item", "Upstock stock quantity", "Return to main menu"]
        }
    ]).then(function (response) {
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
                    if (response === true) {
                        //usen a insert into method to create new item
                        //newItem.name
                        //newItem.department
                        //newItem.price
                        //newItem.quantity
                    }
                    else {
                        console.log("Due to wrong information, item was not added.");
                        manageInventory();
                    }
                });
            });
        }
        if (response.selection === "Upstock stock quantity") {
            readProducts();
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
                //read item at selected ID position
                //read current stock at ID number, add newStock to it
                console.log("Added # to (read name position)");
            });
        }
        if (response.selection === "Return to main menu") {
            onStart();
        }
    });
};
// verify id and product name
// ask new qty, verify new qty,
// update qty and reprint entire stock with updated qty

// sign out- exits application
function signOut() {
    connection.end();
}

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
    });
};

function readByDepartment(department) {
    //use a query to select using department
};

//begins application
onStart();
