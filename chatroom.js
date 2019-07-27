// JS file for chatroom.html page


// HTML Variables
var messageScreen = document.getElementById('messages');
var messageForm = document.getElementById('messageForm');
var messageInput = document.getElementById('msgInput');


// Database Variables
var db = firebase.database();
var msgRef = db.ref('/msgs');
var userRef = db.ref('/users');
var user = firebase.auth().currentUser;
var uid;


// Getting uid if user loaded
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        uid = user.uid;
    } else {
        // No user is signed in.
        location.replace('loginpage.html');
    }
});


// Sending message button function
$('#msgBtn').click(function() {
    var text = messageInput.value;
    var name = 'anonymouschatuser';

    userRef.once("value", function(snapshot) {
        snapshot.forEach(function(child) {
            var {id : userID, email: userEmail, name : userName} = child.val();

            if (uid === userID) {
                name = userName;

                if (!text.trim()) {
                    return alert('YOU HAVE TO TYPE IN A MESSAGE');
                }
                
                var msg = {
                    id: uid,
                    name: name,
                    text: text
                }
                
                msgRef.push(msg);
                messageInput.value = '';
            }
        });
    });
});


// Updating messages after one is sent
msgRef.on('child_added', function(data) {
    var {id : userID, name, text} = data.val();
    
    var msg = '<div class="incoming_msg"><div class="received_msg"><div class="received_withd_msg"><p><b>' + name + ':</b>' + text + '</p></div></div>';
    if (uid == userID) {
        msg = '<div class="outgoing_msg"><div class="sent_msg"><p>' + text + '</p></div></div>';
	}
    
    messageScreen.innerHTML += msg;
});


// Going to profile page function
$('#profileBtn').click(function() {
    location.replace('profile.html');
});
