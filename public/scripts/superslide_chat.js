var superSlideChat = (function () {

  var superSlideChat = {};
  var chat;
  var username;

  var chatbox;
  var chatboxTitle;
  var closeChat;
  var messageInput;
  var messageBtn;
  var messageBox;
  var btnChat;

  function sendMessage() {
    var text = messageInput.value;
    console.log(text);
    chat.push({name: username, text: text});
    messageInput.value = "";
  }

  superSlideChat.init = function(opt) {
    chatbox = document.getElementById("chatbox");
    chatboxTitle = document.getElementById("chatboxTitle");
    messageInput = document.getElementById("messageInput");
    messageBox = document.getElementById("messageBox");
    closeChat = document.getElementById("closeChat");
    btnChat = document.getElementById("btn-chat");

    chat = new Firebase(opt.firebaseUrl + '/chat');
    username = opt.username;

    chatbox.classList.remove('hidden');
    messageInput.focus();
    chatboxTitle.textContent = "Chatting as " + opt.username;

    messageInput.addEventListener('keydown', function(e) {
      e.stopPropagation();
      if (e.which == 13) {
        sendMessage();
      }
    });

    chatboxTitle.addEventListener('click', function (e) {
      if(chatbox.classList.contains('minimized')) {
        chatbox.classList.remove('minimized');
      } else {
        chatbox.classList.add('minimized');
      }
    });

    btnChat.addEventListener('click', function (e) {
      if(chatbox.classList.contains('hidden')) {
        chatbox.classList.remove('hidden');
        btnChat.classList.add('active');
      } else {
        chatbox.classList.add('hidden');
        btnChat.classList.remove('active');
      }
    });

    closeChat.addEventListener('click', function (e) {
      chatbox.classList.add('hidden');
      btnChat.classList.remove('active');
    });

    chat.on('child_added', function(snapshot) {
      var message = snapshot.val();
      displayChatMessage(message.name, message.text);
      if(message.name != username)
        chatbox.classList.add('new-msg');
    });

    chatbox.addEventListener('click', function () {
      chatbox.classList.remove('new-msg');
    });

    function displayChatMessage(name, text) {
      var newMsg = document.createElement('div');
      var newName = document.createElement('strong');
      newName.textContent = name + ": ";
      var newText = document.createTextNode(text);
      newMsg.appendChild(newName);
      newMsg.appendChild(newText);
      messageBox.appendChild(newMsg);
      messageBox.scrollTop = messageBox.scrollHeight;
    }

    setTimeout(function () {
      chatbox.classList.remove('new-msg');
    }, 1000);
  };

  return superSlideChat;

})();