	// variable publique
	//superSlideLogin.count = 5;
	// variable privée
	//var count = 3;
	
	// methode publique
	//superSlideLogin.login = function() {
	//};
	// methode privée
	//function login() {
	//}

var superSlideCreateUser = (function () {
	var superSlideCreateUser = {};
	
	superSlideCreateUser.init = function() {
		$(document).ready(function(){
			$(document).on("click", "#createUser", function () {
			
				var email = $('#inputEmail').val();
				var password = $('#inputPassword').val();
				var confirmPassword = $('#inputConfirmPassword').val();
				
				if (password == confirmPassword) {
					var firebaseObject = new Firebase(superSlide.firebaseUrl);
					firebaseObject.createUser({
						email    : email,
						password : password
						}, function(error) {
						if (error === null) {
							$(location).attr('href',"home.html");
							console.log("User created successfully");
						//	alert("User created successfully");
						} else {
							console.log("Error creating user:", error);
							alert("Error creating user: ", error);
						}
					});
				}
				else {
					alert ("Passwords are not equal");
				}
			});
		});
	};
	return superSlideCreateUser;
})();


var superSlideLogin = (function () {
	var superSlideLogin = {};
	superSlideLogin.init = function() {
		$(document).ready(function(){
			$(document).on("click", "#signIn", function () {
			
				var email = $('#inputEmail').val();
				var password = $('#inputPassword').val();

				var firebaseObject = new Firebase(superSlide.firebaseUrl);
				firebaseObject.authWithPassword({
					email    : email,
					password : password
					}, function(error, authData) {
					if (error === null) {
						// user authenticated with Firebase
						console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
						console.log("authData : " + authData);
						
						// Test token ..
						/*var authData = firebaseObject.getAuth();
				var firebaseObject = new Firebase(superSlide.firebaseUrl);
						if (authData) {
						  console.log('Authenticated user with uid:', authData.uid);
						  console.log('Authenticated user with token:', authData.token);
						}*/
						// Test token
						
						$(location).attr('href',"home.html");
						
						//alert("User ID: " + authData.uid + ", Provider: " + authData.provider);
					} else {
						console.log("Error authenticating user:", error);
						//alert("Error authenticating user:", error);
					}
				});
			});
		});
	};
	return superSlideLogin;
})();