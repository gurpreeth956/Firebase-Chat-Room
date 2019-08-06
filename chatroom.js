/* JS file for chatroom.html page
 *
 * This page is for the actual chatroom and includes all the functions for the chatroom.
 * The functions include showing all the messages in the chatroom and adding messages
 *  
 */


// HTML Variables
var messageScreen = document.getElementById('messages');
var messageForm = document.getElementById('messageForm');
var messageInput = document.getElementById('msgInput');


// Database Variables
var db = firebase.database();
var msgRef = db.ref('/msgs');
var userRef = db.ref('/users');
var user = firebase.auth().currentUser;
var storage = firebase.storage();
var imageRef = storage.ref('/images');
var uid, messageCount = 0;
var allMessages = [];
var pageStarted = true;


// Getting uid if user loaded
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        uid = user.uid;
    } else {
        // No user is signed in.
        location.replace('loginpage.html');
    }
});


// When enter key is pressed
$(document).keypress(function(event) {
    if (event.which == '13') {
        event.preventDefault();
        var text = messageInput.value;

        if (text.trim()) {
            sendMessage();
        } else {
            alert("Nothing was entered");
        }
    }
});


// Enabling send button
$(document).ready(function() {
    $('#msgBtn').attr('disabled', 'disabled');
    $('input[type="text"]').keyup(function() {
        if($('#msgInput').val() != '') {
            $('#msgBtn').removeAttr('disabled');
        } else {
            $('#msgBtn').attr('disabled', 'disabled');
        }
    });
});


// For loading messages after images
$(document).ready(function() {
    // Code to be executed after 2 second
    setTimeout(function() {
        // All messages will be added to screen in order
        allMessages.forEach(function(item) {
            messageScreen.innerHTML += item;
        });

        pageStarted = false;
        $('#msgInput').removeAttr('disabled');
    }, 2000);
});


// Going to profile page function
$('#profileBtn').click(function() {
    location.replace('profile.html');
});


// When send message button clicked
$('#msgBtn').click(function() {
    sendMessage();
});


// Sending message button function
function sendMessage() {
    var text = messageInput.value;
    var name = 'anonymouschatuser';

    // For adding the messages
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
                    text: text,
                    count: messageCount,
                }
                
                msgRef.push(msg);
                messageInput.value = '';
            }
        });
    });
}


// Updating messages after one is sent
msgRef.on('child_added', function(data) {
    var {id : userID, name, text, count} = data.val();
    
    // Getting user profile pic
    var imageRef = storage.ref('/images/' + userID);
    var imageFileLink = "", msg = "";

    // Adding message and image to screen
    imageRef.getDownloadURL().then(function(url) {
        imageFileLink = url;
        addMessageToScreen(msg, imageFileLink, uid, userID, name, text, count);
    }).catch(function(error) {
        imageRef = storage.ref('/images/no_user.png');
        imageRef.getDownloadURL().then(function(url) {
            imageFileLink = url;
            addMessageToScreen(msg, imageFileLink, uid, userID, name, text, count);
        });
    });

    messageCount++;
});


// Method for adding messages
function addMessageToScreen(msg, imageFileLink, uid, userID, name, text, count) {
    // For other users
    var msg = '<div class="chat_img"> <img src="' + imageFileLink + '" alt="" style="width:50px; height:30px;"> </div>' +
              '<div class="incoming_msg"><div class="received_msg"><div class="received_withd_msg"><p><b>' + name + ':</b>' + text + '</p></div></div>';
    
    // For your messages
    if (uid == userID) {
        msg = '<div class="chat_img"> <img src="" alt=""> </div>' +
              '<div class="outgoing_msg"><div class="sent_msg"><p>' + text + '</p></div></div>';
    }

    if (!pageStarted) {
        messageScreen.innerHTML += msg;
    }
    allMessages[count] = msg;
}
