// JS file for loginpage.html page


// Database Variables
var db = firebase.database();
var namesRef = db.ref("/names");


// Enabling login button
$(document).ready(function() {
    $('#loginBtn').attr('disabled', 'disabled');
    $('input[type="text"]').keyup(function() {
        if($('#email').val() != '' && $('#password').val() != '') {
            $('#loginBtn').removeAttr('disabled');
        } else {
            $('#loginBtn').attr('disabled', 'disabled');
        }
    });
});


// Enabling signup button
$(document).ready(function() {
    $('#signupBtn').attr('disabled', 'disabled');
    $('input[type="text"]').keyup(function() {
        if($('#email').val() != '' && $('#password').val() != '' && $('#name').val() != '') {
            $('#signupBtn').removeAttr('disabled');
        } else {
            $('#signupBtn').attr('disabled', 'disabled');
        }
    });
});


// Login button function
$('#loginBtn').click(function() {
	var email = $("#email").val();
    var password = $("#password").val();
        
    if (email != "" && password != "") {
        firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            location.replace("chatroom.html");
            return;
        }).catch(function(error) {
            // An error happened
            return alert(error.message);
        });
    } else {
    	return alert("Enter something");
    }
});


// Signup button function
$('#signupBtn').click(function() {
	var email = $("#email").val();
    var password = $("#password").val();
    var name = $("#name").val();
        
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
        location.replace("chatroom.html");
    }).catch(function(error) {
        // An error happened
        return alert(error.message);
    });

    // Now add user name to database
    var user = firebase.auth().currentUser;
    var uid;
    // Getting uid if user loaded
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = user.uid;

            var userData = {
                id: uid,
                name: name,
                email: email
            }
            
            namesRef.push(userData);
        } else {
            // No user is signed in.
        }
    });
});


// Change password button function
$("#passwordValBtn").click(function() {
    var email = $("#emailChange").val();

    firebase.auth().sendPasswordResetEmail(email).then(function() {
        $('#forgotpasswordmodal').modal('hide');
        return alert("Password Reset Sent!");
    }).catch(function(error) {
        // An error happened.
        return alert(error.message);
    });
});

