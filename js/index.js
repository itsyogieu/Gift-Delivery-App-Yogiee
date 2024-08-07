//==================================index.js==================================//

var debug = false;
var authenticated = false;

$(document).ready(function () {

    // Initialize default users if not present
    if (!localStorage.allUsers) {
        if (debug) alert("Users not found - creating a default user!");
        var userData = {email:"admin@domain.com", password:"admin", firstName:"CQU", lastName:"User", state:"QLD", phoneNumber:"0422919919", address:"700 Yamba Road", postcode:"4701"};
        var allUsers = [];
        allUsers.push(userData); 
        localStorage.setItem("allUsers", JSON.stringify(allUsers));
    } else {
        if (debug) alert("Users Array found - loading.."); 		
        var allUsers = JSON.parse(localStorage.allUsers);    
    }

    // Event handler for login
    $('#loginButton').click(function () {
        localStorage.removeItem("inputData");
        $("#loginForm").submit();
        if (localStorage.inputData != null) {
            var inputData = JSON.parse(localStorage.getItem("inputData"));
            var allUsers = JSON.parse(localStorage.getItem("allUsers"));	
            allUsers.forEach(function(userData){		
                if (inputData.email == userData.email && inputData.password == userData.password) {
                    authenticated = true;
                    alert("Login success");
                    localStorage.setItem("userInfo", JSON.stringify(userData));
                    localStorage.setItem("currentUserEmail", userData.email); // Save current user email
                    $.mobile.changePage("#homePage");
                } 
            }); 	
            if (authenticated == false){
                alert("Login failed");
            }
            $("#loginForm").trigger('reset');
        }	
    });

    // Form validation for login
    $("#loginForm").validate({
        focusInvalid: false,  
        onkeyup: false,
        submitHandler: function (form) {   
            var formData =$(form).serializeArray();
            var inputData = {};
            formData.forEach(function(data){
                inputData[data.name] = data.value;
            })
            localStorage.setItem("inputData", JSON.stringify(inputData));		
        },
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                rangelength: [3, 10]
            }
        },
        messages: {
            email: {
                required: "Please enter your email",
                email: "The email format is incorrect"
            },
            password: {
                required: "Password cannot be empty",
                rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}.")
            }
        }
    });
// Event handler for Submitbutton
$(document).ready(function () {
    $('#submitButton').click(function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get values from the form
        var email = $('#email').val().trim();
        var password = $('#password').val().trim();
        var firstName = $('#firstName').val().trim();
        var lastName = $('#lastName').val().trim();
        var state = $('#state').val();
        var phoneNo = $('#phoneNumber').val().trim();
        var address = $('#address').val().trim();
        var postcode = $('#postcode').val().trim();
        

        // Validation checks
        if (!email || !password || !firstName || !lastName || !state || !phoneNo || !address || !postcode) {
            alert("All fields are required.");
            return;
        }

        // Retrieve existing users from localStorage
        var allUsers = localStorage.getItem("allUsers");
        allUsers = allUsers ? JSON.parse(allUsers) : [];

        // Check if the email is already registered
        var userExists = allUsers.some(function(user) {
            return user.email === email;
        });

        if (userExists) {
            alert("Email is already registered.");
        } else {
            // Create new user object
            var newUser = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                state: state,
                phoneNo: phoneNo,
                address: address,
                postcode: postcode
            };

            // Add new user to the list
            allUsers.push(newUser);
            localStorage.setItem("allUsers", JSON.stringify(allUsers));

            alert("Signup successful!");

            // Redirect to login page or home page
            $.mobile.changePage("#loginPage"); // Assuming you have a login page
        }

        // Reset form after processing
        $("#registrationForm").trigger('reset');
    });
});
    // Event handler for item selection
    $('#itemList li').click(function () {
        var itemName = $(this).find('#itemName').html();
        var itemPrice = $(this).find('#itemPrice').html();
        var itemImage = $(this).find('#itemImage').attr('src');
        localStorage.setItem("itemName", itemName);
        localStorage.setItem("itemPrice", itemPrice);
        localStorage.setItem("itemImage", itemImage);
    });

    // Event handler for order confirmation
    $('#confirmOrderButton').on('click', function () {
        var dispatchDate = $('#dispatchDate').val();
        localStorage.removeItem("inputData");
        $("#orderForm").submit();
        if (localStorage.inputData != null) {
            var orderInfo = JSON.parse(localStorage.getItem("inputData"));
            orderInfo.item = localStorage.getItem("itemName");
            orderInfo.price = localStorage.getItem("itemPrice");
            orderInfo.img = localStorage.getItem("itemImage");
            var userInfo = JSON.parse(localStorage.getItem("userInfo"));
            orderInfo.customerEmail = userInfo.email;
            orderInfo.orderNo = Math.trunc(Math.random() * 1000000);
            orderInfo.date = dispatchDate;

            localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
            var allOrders = [];
            if (localStorage.allOrders != null) 
                allOrders = JSON.parse(localStorage.allOrders); 
            allOrders.push(orderInfo);
            localStorage.setItem("allOrders", JSON.stringify(allOrders));
            $("#orderForm").trigger('reset');
            $.mobile.changePage("#orderConfirmationPage");
             // Reset the form
        $("#orderForm").trigger('reset');

        // Redirect to the Order List page
        $.mobile.changePage("#orderListPage"); // Ensure this matches your page ID
    } else {
        console.error("inputData is null or undefined.");
    }
});
    // Form validation for order
    $("#orderForm").validate({
        focusInvalid: false, 
        onkeyup: false,
        submitHandler: function (form) {   
            var formData =$(form).serializeArray();
            var inputData = {};
            formData.forEach(function(data){
                inputData[data.name] = data.value;
            });
            localStorage.setItem("inputData", JSON.stringify(inputData));				
        },
        rules: {
            firstName: {
                required: true,
                rangelength: [1, 15],
                validateName: true
            },
            lastName: {
                required: true,
                rangelength: [1, 15],
                validateName: true
            },
            phoneNumber: {
                required: true,
                mobiletxt: true
            },
            address: {
                required: true,
                rangelength: [1, 25]
            },
            postcode: {
                required: true,
                posttxt: true
            }
        },
        messages: {
            firstName: {
                required: "Please enter your firstname",
                rangelength: $.validator.format("Contains a maximum of {1} characters")
            },
            lastName: {
                required: "Please enter your lastname",
                rangelength: $.validator.format("Contains a maximum of {1} characters")
            },
            phoneNumber: {
                required: "Phone number required"
            },
            address: {
                required: "Delivery address required",
                rangelength: $.validator.format("Contains a maximum of {1} characters")
            },
            postcode: {
                required: "Postcode required"
            }
        }
    });

    // Event handler for login page initialization
    $(document).on("pagebeforeshow", "#loginPage", function() {
        localStorage.removeItem("userInfo");
        authenticated = false;
    });  

    // Event handler to populate the Fill Order page
    $(document).on("pagebeforeshow", "#fillOrderPage", function() {
        $("#itemSelected").html(localStorage.getItem("itemName"));
        $("#priceSelected").html(localStorage.getItem("itemPrice"));
        $("#imageSelected").attr('src', localStorage.getItem("itemImage"));
    });  

    // Event handler to populate the Order Confirmation page
    $(document).on("pagebeforeshow", "#orderConfirmationPage", function() {
        $('#orderInfo').html("");
        if (localStorage.orderInfo != null) {
            var orderInfo = JSON.parse(localStorage.getItem("orderInfo"));
            $('#orderInfo').append('<br><table><tbody>');
            $('#orderInfo').append('<tr><td>Order no: </td><td><span class="fcolor">' + orderInfo.orderNo + '</span></td></tr>');	
            $('#orderInfo').append('<tr><td>Customer: </td><td><span class="fcolor">' + orderInfo.customerEmail + '</span></td></tr>');	
            $('#orderInfo').append('<tr><td>Item: </td><td><span class="fcolor">' + orderInfo.item + '</span></td></tr>');	
            $('#orderInfo').append('<tr><td>Price: </td><td><span class="fcolor">' + orderInfo.price + '</span></td></tr>');
            $('#orderInfo').append('<tr><td>Recipient: </td><td><span class="fcolor">' + orderInfo.firstName + ' ' + orderInfo.lastName + '</span></td></tr>');
            $('#orderInfo').append('<tr><td>Phone number: </td><td><span class="fcolor">' + orderInfo.phoneNumber + '</span></td></tr>');
            $('#orderInfo').append('<tr><td>Address: </td><td><span class="fcolor">' + orderInfo.address + ' ' + orderInfo.postcode + '</span></td></tr>');
            $('#orderInfo').append('<tr><td>Dispatch date: </td><td><span class="fcolor">' + orderInfo.date + '</span></td></tr>');
            $('#orderInfo').append('</tbody></table><br>');
        } else {
            $('#orderInfo').append('<h3>There is no order to display<h3>');
        }
    });

    // Event handler to populate the Order List page
	$(document).on("pagebeforeshow", "#orderListPage", function() {
        function displayOrders() {
            // Retrieve all orders from local storage
            var orders = JSON.parse(localStorage.getItem('allOrders')) || [];
            // Get the currently logged-in user's email
            var currentUserEmail = JSON.parse(localStorage.getItem('userInfo')).email;
            
            // Filter orders for the current user
            var userOrders = orders.filter(function(order) {
                return order.customerEmail === currentUserEmail;
            });

           // Generate HTML for displaying orders
        var orderListHtml = '';
        if (userOrders.length > 0) {
            userOrders.forEach(function(order) {
                orderListHtml += `
                    <div class="order-item">
                        <p><strong>Order No:</strong> ${order.orderNo}</p>
                        <p><strong>Customer:</strong> ${order.customerEmail}</p> <!-- Added Customer -->
                        <p><strong>Item:</strong> ${order.item}</p>
                        <p><strong>Price:</strong> ${order.price}</p>
                        <p><strong>Recipient:</strong> ${order.firstName} ${order.lastName}</p>
                        <p><strong>Phone Number:</strong> ${order.phoneNumber}</p>
                        <p><strong>Address:</strong> ${order.address} ${order.postcode}</p>
                        <p><strong>Dispatch Date:</strong> ${order.date}</p> <!-- Display dispatch date -->
                    </div>
                    <hr>
                `;
            });
        } else {
            orderListHtml = '<p>No orders found.</p>';
        }

        // Update the HTML of the order list container
        $('#orderListContainer').html(orderListHtml);
    }

    displayOrders();
});
});    

// Handle deletion of orders
$(document).ready(function() {
    $("#deleteOrdersButton").click(function() {
        // Get all orders from localStorage
        var allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
        console.log("Initial Orders:", allOrders); // Log initial orders

        var deletedCount = allOrders.length; // Count all orders to be deleted

        // Clear all orders
        localStorage.removeItem("allOrders");

        // Store the count of deleted orders in localStorage for use on the confirmation page
        localStorage.setItem("deletedCount", deletedCount);

        // Redirect to the delete confirmation page
        $.mobile.changePage("#deleteConfirmationPage");
    });

    // Update delete confirmation page with deleted count
    $(document).on("pagebeforeshow", "#deleteConfirmationPage", function() {
        var deletedCount = localStorage.getItem("deletedCount") || 0;
        $("#deleteInfo").text(deletedCount + " order(s) deleted.");
        // Clear the deleted count from localStorage
        localStorage.removeItem("deletedCount");
    });

    // Redirect to home page when done button is clicked
    $("#doneButton").click(function() {
        $.mobile.changePage("#homePage");
    });
});
