function getDistance(planet1, planet2) {
  planet = Planets.findOne({name: planet1});
  switch(planet2) {
    case "Jute":
      distance = planet.distances.Jute;
      break;
    case "Ovas":
      distance = planet.distances.Ovas;
      break;
    case "Craeva":
      distance = planet.distances.Craeva;
      break;
    case "Antonia":
      distance = planet.distances.Antonia;
      break;
    case "Faelvaen":
      distance = planet.distances.Faelvaen;
      break;
    case "Gezz":
      distance = planet.distances.Gezz;
      break;
    case "Ord":
      distance = planet.distances.Ord;
      break;
    case "Divaran":
      distance = planet.distances.Divaran;
      break;
    default:
      distance = 0;
  }
  return distance;
}

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

if (Meteor.isClient) {
  //
  // Player Template
  //
  Template.player.username = function () {
    return Meteor.user().username;
  }

  Template.player.events({
    'click a#logoutButton': function (evt) {
      Meteor.logout();
      evt.preventDefault();
    }
  });  

  //
  // Planets Template
  //
  Template.planets.show = function () {
    return true;
  }  

  Template.planets.planets = function () {
    return Planets.find();
  }
  Template.planets.distance = function () {
    player = Users.findOne( {_id: Meteor.userId()} );
    currentPlanet = Planets.findOne({name: player.planet});
    distance = 0;
    return distance;
  }
  Template.planets.events({
    'change #planetSelect': function (evt) {
      var newplanet = $('#planetSelect').val()
      if (newplanet != '') {
        player = Users.findOne( {_id: Meteor.userId()} );
        currentPlanet = Planets.findOne({name: player.planet});
        distance = getDistance(currentPlanet.name, newplanet);
        if (player.fuel >= distance) {
          Meteor.call('travel', Meteor.userId(), newplanet);
        } else {
          alert("You must wait for your ships fuel to recharge");
        }
      }
    }
  });

  //
  // Ship Template
  //
  Template.ship.planet = function () {
    planet = '';
    var player = Users.findOne({_id: Meteor.userId()});
    if (player != null) {
      planet = player.planet
    }
    return planet;
  }  
  Template.ship.fuelLevel = function () {
    fuel = 0;
    player = Users.findOne({_id: Meteor.userId()});
    if (player) {
      fuel = player.fuel;
    }
    return fuel;
  }
  Template.ship.fuelPercent = function () {
    fuel = 0;
    player = Users.findOne({_id: Meteor.userId()});
    if (player) {
      fuel = player.fuel;
    }
    fuelPercent = (fuel / 2000) * 100;
    return fuelPercent;
  }
  //
  // Barracks template
  //
  Template.barracks.soldiers = function() {
    soldiersHere = [];
    user = Users.findOne({_id: Meteor.userId()});
    if (user != null && user != undefined) {
      currentPlanet = user.planet;
      planet = Planets.findOne({name: currentPlanet});
      if (planet != null && planet != undefined) {
        freeSoldiers = planet.soldiers;
        for (i = 0; i < freeSoldiers.length; i++) {
          soldiersHere.push(Soldiers.findOne({_id: freeSoldiers[i]}));
        }         
      }     
    }
    return soldiersHere;
  }
}

//////
////// Initialization
//////

Meteor.startup(function () {

  // subscribe to all the players, the game i'm in, and all
  // the words in that game.
  Deps.autorun(function () {
    Meteor.subscribe('userData');
    Meteor.subscribe('planets');
    Meteor.subscribe('soldiers');

  });

  // send keepalives so the server can tell when we go away.
  //
  // XXX this is not a great idiom. meteor server does not yet have a
  // way to expose connection status to user code. Once it does, this
  // code can go away.
  Meteor.setInterval(function() {
    if (Meteor.status().connected)
      Meteor.call('keepalive', Meteor.userId());
  }, 20*1000);
});

