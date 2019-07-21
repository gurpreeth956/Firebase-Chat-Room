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

$('#signupBtn').click(function() {
	var email = $("#email").val();
    var password = $("#password").val();
        
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
        location.replace("chatroom.html");
    }).catch(function(error) {
        // An error happened
        return alert(error.message);
    });
});

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
