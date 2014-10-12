var superSlideUser = (function () {

  var superSlideUser = {};

  var ref = new Firebase(superSlide.firebaseUrl);

  superSlideUser.listenPresentations = function(callback) {
    var authData = ref.getAuth();
    if (authData) {
      var userRef = new Firebase(superSlide.firebaseUrl + '/user/' + authData.uid + "/presentations");
      userRef.on('child_added',  function(snapshot) {
        var presentation = snapshot;
        callback(presentation);
      });
    } else {
      window.location('/');
      //alert('User is not logged in, this should not happen ! (or we should redirect to login)');
    }
  }

  return superSlideUser;

})();