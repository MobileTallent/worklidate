starter.factory("Auth", function($firebaseAuth,$rootScope) {
  var usersRef = firebase.database().ref("/users");
  return $firebaseAuth(usersRef);
}
];
