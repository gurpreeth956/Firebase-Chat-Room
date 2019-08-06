// JS file for profile.html page


// HTML Variable
var messageName = document.getElementById('username');


// Database Variables
var db = firebase.database();
var msgRef = db.ref('/msgs');
var userRef = db.ref('/users');
var user = firebase.auth().currentUser;
var storage = firebase.storage();
var imageRef = storage.ref('/images');
var uid, name, email;


// Redirecting to chatroom page if logged in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        uid = user.uid;
        email = user.email;

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


// When enter key is pressed
$(document).keypress(function(event) {
    if (event.which == '13') {
        event.preventDefault();
        var text = messageInput.value;
    }
});


// Updating name value on profile page
userRef.on('child_added', function(data) {
    var {id : userID, name : username, email} = data.val();
    
    if (userID == uid) {
        messageName.innerHTML = username;
        name = username;
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


// Change name button function
$('#nameChangeBtn').click(function() {
    var newName = $('#nameChange').val();
    var oldName = name;

    // Change name value in users
    userRef.orderByChild('name').equalTo(name).once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            childSnapshot.ref.update({ name: newName });
            name = newName;
        });
    });

    // Change neame value in messages
    msgRef.orderByChild('name').equalTo(oldName).once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            childSnapshot.ref.update({ name: newName });
        });
    });

    location.reload('#');
});


// Change password button function
$('#changePassBtn').click(function() {
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        $('#forgotpasswordmodal').modal('hide');
        return alert('Password Reset Sent!');
    }).catch(function(error) {
        // An error happened
        return alert(error.message);
    });
});
