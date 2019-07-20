var messageScreen = document.getElementById("messages");
var messageForm = document.getElementById("messageForm");
var msgInput = document.getElementById("msg-input");
var msgBtn = document.getElementById("msg-btn");
var nameForm = document.getElementById("nameForm");
var nameInput = document.getElementById("name-input");
var nameBtn = document.getElementById("name-btn");

var db = firebase.database();
var msgRef = db.ref("/msgs");
var id = uuid();
var name;


function enterMessage() {
    var text = msgInput.value;
    
    if (!name) {
    	return alert("YOU HAVE TO SET UP A NAME");
    } else if (!text.trim()) {
        return alert("YOU HAVE TO TYPE IN A MESSAGE");
    }
    
    var msg = {
        id: id,
        name: name,
        text: text
    }
    
    msgRef.push(msg);
    msgInput.value = '';
}


var updateMsges = data => {
    var {id : userID, name, text} = data.val();
    
    var msg = "<li class=\"msg\"><span><i class=\"name\">" + name + ": " +
        	  "</i>" + text + "</span></li>"
    if (id == userID) {
        msg = "<li class=\"msg my\"><span><i class=\"name\">" + name + ": " +
        	  "</i>" + text + "</span></li>"
	}
    
    messageScreen.innerHTML += msg;
}

msgRef.on('child_added', updateMsges)


function enterName() {
    if (nameInput.value.trim().length < 4) {
        return alert("ENTER AT LEAST 4 LETTERS");
    }
    
    nameForm.style.display = "none";
    msgInput.removeAttribute("disabled");
    msgBtn.removeAttribute("disabled");
    return (name = nameInput.value);
}
