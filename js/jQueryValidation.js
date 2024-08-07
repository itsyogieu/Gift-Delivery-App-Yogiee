/* validation cannot contain numbers */
$.validator.addMethod("validateName", function (value, element) {
    var v_regex = /^(?=.*\d.*\b)/;
    if (!v_regex.test(value)) {
        return true;
    } else {
        return false;
    }
}, "Name cannot contain numbers");

/* PhoneNumber */
$.validator.addMethod("mobiletxt", function (value, element) {
    var v_regex = /^\d{10}$/; // Matches exactly 10 digits
    return v_regex.test(value);
}, "Phone number must be exactly 10 digits");
/* The postcode has four digits */
$.validator.addMethod("posttxt", function (value, element) {
    var v_regex = /^\d{6}$/; // Matches exactly 6 digits
    return v_regex.test(value);
}, "Postcode must be exactly 6 digits");


/* Time validation */
$.validator.addMethod("datetime", function (value, element) {
    function isToday(date) {
        return date.toString().slice(0, 10) > new Date().toString().slice(0, 10);
    }
    if (isToday(date)) {
        return true;
    } else {
        return false;
    }

}, "Please select a time after that day");