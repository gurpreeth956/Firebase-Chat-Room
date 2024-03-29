/* JS file for loginpage.html page
 *
 * This page is for allowing the user to login to the chatroom or make an account.
 * The functions include signing up and signing in and resetting password.
 *  
 */


// HTML Variables


// Database Variables
var db = firebase.database();
var userRef = db.ref('/msgs');
var usersRef = db.ref('/users');
var user = firebase.auth().currentUser;
var storage = firebase.storage();
var imageRef = storage.ref('/images');


// Other Variables
// None


// Redirecting to chatroom page if logged in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      location.replace('chatroom.html');
    } else {
      // No user is signed in
    }
});


// When enter key is pressed
$(document).keypress(function(event) {
    if (event.which == '13') {
        event.preventDefault();
    }
});


// Enabling login button
$(document).ready(function() {
    $('#loginBtn').attr('disabled', 'disabled');
    $('input[type="text"]').keyup(function() {
        if($('#email').val() != '' && $('#password').val() != '') {
            // Login button enabled if texts not empty
            $('#loginBtn').removeAttr('disabled');
        } else {
            // Login button enabled if texts are empty
            $('#loginBtn').attr('disabled', 'disabled');
        }
    });
});


// Enabling signup button
$(document).ready(function() {
    $('#signupBtn').attr('disabled', 'disabled');
    $('input[type="text"]').keyup(function() {
        if($('#email').val() != '' && $('#password').val() != '' && $('#name').val() != '') {
            // Signup button enabled if texts not empty
            $('#signupBtn').removeAttr('disabled');
        } else {
            // Signup button enabled if texts are empty
            $('#signupBtn').attr('disabled', 'disabled');
        }
    });
});


// Login button function
$('#loginBtn').click(function() {
	var email = $('#email').val();
    var password = $('#password').val();
        
    if (email != '' && password != '') {
        firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            location.replace('chatroom.html');
        }).catch(function(error) {
            // An error happened
            return alert(error.message);
        });
    } else {
        if (email == '') {
            return alert('Please enter an email');
        } else if (password == '') {
            return alert('Please enter a password');
        } else {
            return alert('There was an unknown error...');
        }
    }
});


// Signup button function
$('#signupBtn').click(function() {
	var email = $('#email').val();
    var password = $('#password').val();
    var name = $('#name').val();
        
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
        // Now add user name to database
        user = firebase.auth().currentUser;
        
        // Getting uid if user loaded
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var uid = user.uid;

                // Create user data type
                var userData = {
                    id: uid,
                    name: name,
                    email: email
                }
                
                // Push person to firebase
                usersRef.push(userData);
            } else {
                // No user is signed in.
            }
        });
        
        // Now go to chatroom page
        location.replace('chatroom.html');
    }).catch(function(error) {
        // An error happened
        if (email == '') {
            return alert('Please enter an email');
        } else if (password == '') {
            return alert('Please enter a password');
        } else if (name == '') {
            return alert('Please enter a name');
        } else {
            return alert(error.message);
        }
    });
});


// Change password button function
$('#passwordValBtn').click(function() {
    var email = $('#emailChange').val();

    firebase.auth().sendPasswordResetEmail(email).then(function() {
        $('#forgotpasswordmodal').modal('hide');
        return alert('Password Reset Sent!');
    }).catch(function(error) {
        // An error happened
        if (email == '') {
            return alert('Please enter an email');
        } else {
            return alert(error.message);
        }
    });
});
