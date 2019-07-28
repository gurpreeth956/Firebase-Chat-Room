// JS file for profile.html page


// Database Variables
var db = firebase.database();
var user = firebase.auth().currentUser;
var storage = firebase.storage();
var imageRef = storage.ref('/images');
var uid;


// Redirecting to chatroom page if logged in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        uid = user.uid;

        // Getting user profile image
        imageRef = storage.ref('/images/' + uid);
        imageRef.getDownloadURL().then(function(url) {
            document.querySelector('img').src = url;
        }).catch(function(error) {
            imageRef = storage.ref('/images/no_user.png');
            imageRef.getDownloadURL().then(function(url) {
                document.querySelector('img').src = url;
            });
        });
    } else {
        // No user is signed in.
        imageRef = storage.ref('/images/no_user.png');
        imageRef.getDownloadURL().then(function(url) {
            document.querySelector('img').src = url;
        });
        location.replace('loginpage.html');
    }
});


// Logout button function
$('#logoutBtn').click(function() {
    firebase.auth().signOut().then(function() {
        // Sign out successful
        document.querySelector('img').src = "";
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
    
    newFile = new File([file], uid + '.png', {type: 'image/png'});
    imageRef = storage.ref('/images/' + uid);
    imageRef.put(newFile).then(function(snapshot) {
        // Image succussfully saved in storage
    });
}
