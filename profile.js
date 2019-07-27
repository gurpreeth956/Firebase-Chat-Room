// JS file for profile.html page


// Database Variables
var db = firebase.database();
var user = firebase.auth().currentUser;


// Redirecting to chatroom page if logged in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
    } else {
      // No user is signed in.
      location.replace('loginpage.html');
    }
});


// Logout button function
$('#logoutBtn').click(function() {
    firebase.auth().signOut().then(function() {
        // Sign out successful
        location.replace('loginpage.html');
    }, function(error) {
        // An error happened
        alert(error.message);
    });
});


// Back to chatroom function
$('#chatroomBtn').click(function() {
    location.replace('chatroom.html');
});


// Profile picture function
function previewFile() {
    var preview = document.querySelector('img');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file); // Reads the data as a URL
    } else {
        preview.src = "";
    }
}
