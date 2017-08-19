const apiToken = 'd2d6f761dddc4f049da8d14942a6594e';
var app = angular.module('myApp',[]);
app.directive('countdown', ['Util', '$interval', function(Util, $interval) {
  return {
    restrict: 'A',
    scope: {
      date: '@'
    },
    link: function(scope, element) {
      var future;
      future = new Date(scope.date);
      $interval(function() {
        var diff;
        diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
        return element.text(Util.dhms(diff));
      }, 1000);
    }
  };
}]);
app.factory('Util', [
	function() {
    return {
      dhms: function(t) {
        var days, hours, minutes, seconds;
        days = Math.floor(t / 86400);
        t -= days * 86400;
        hours = Math.floor(t / 3600) % 24;
        t -= hours * 3600;
        minutes = Math.floor(t / 60) % 60;
        t -= minutes * 60;
        seconds = t % 60;
        return [days + 'd', hours + 'h', minutes + 'm', seconds + 's'].join(' ');
      }
    };
  }
]);
app.controller('mainCtrl', function($scope, $timeout, $http){
	$scope.switchData = function(){
		$scope.showLeagueTable = true;
		$scope.selectedTeam = "";
	}
	$scope.getAgeFromDateOfBirth = function(birthday){
		var temp = birthday.split('-');
		var actualBirthday = new Date(temp[0], temp[1]-1,temp[2]);
		var ageDifMs = Date.now() - actualBirthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
	$scope.getTeamPlayers = function(playerUrl){
		$scope.loader = true;
		$scope.teamPlayers = [];
		var req = {
			method: 'GET',
			url: playerUrl,
			headers: {
				'X-Auth-Token': apiToken
			}
		}
		$http(req).then(function(response){
			$scope.loader = false;
			$scope.teamPlayers = response.data;
		}).catch(function(err){
			console.log(err);
			$scope.loader = false;
		})
	}
	$scope.getTeamFixtures = function(fixtureUrl){
		$scope.loader = true;
		$scope.teamFixtures = [];
		var req = {
			method: 'GET',
			url: fixtureUrl+'?timeFrame=n50',
			headers: {
				'X-Auth-Token': apiToken
			}
		}
		$http(req).then(function(response){
			$scope.loader = false;
			$scope.teamFixtures = response.data;
		}).catch(function(err){
			console.log(err);
			$scope.loader = false;
		})
	}
	$scope.teamSelected = function(selectedTeam){
		if(selectedTeam){
			$scope.getTeamFixtures(selectedTeam._links.fixtures.href);
			$scope.getTeamPlayers(selectedTeam._links.players.href);
			$scope.showLeagueTable = false;
		}
	}
	$scope.getLeagueTeams = function(selectedLeagueId){
		$scope.leagueTeams = [];
		$scope.loader = true;
		var req = {
			method: 'GET',
			url: 'http://api.football-data.org/v1/competitions/'+selectedLeagueId+'/teams',
			headers: {
				'X-Auth-Token': apiToken
			}
		}
		$http(req).then(function(response){
			$scope.loader = false;
			$scope.leagueTeams = response.data.teams;
		}).catch(function(err){
			console.log(err);
			$scope.loader = false;
		})
	}
	$scope.getLeagueTable = function(selectedLeagueId){
		$scope.leagueTable = [];
		$scope.loader = true;
		var req = {
			method: 'GET',
			url: 'http://api.football-data.org/v1/competitions/'+selectedLeagueId+'/leagueTable',
			headers: {
				'X-Auth-Token': apiToken
			}
		}
		$http(req).then(function(response){
			$scope.loader = false;
			$scope.leagueTable = response.data;
			$scope.showLeagueTable = true;
			$scope.showData = true;
		}).catch(function(err){
			console.log(err);
			$scope.loader = false;
		})
	}
	$scope.leagueSelected = function(selectedLeague){
		$scope.getLeagueTable(selectedLeague.id);
		$scope.getLeagueTeams(selectedLeague.id);
	}
	$scope.getAllCompetitions = function(){
		$scope.loader = true;
		$scope.competitions = [];
		var req = {
			method: 'GET',
			url: 'http://api.football-data.org/v1/competitions/',
			headers: {
				'X-Auth-Token': apiToken
			}
		}
		$http(req).then(function(response){
			$scope.loader = false;
			$scope.competitions = response.data;
		}).catch(function(err){
			console.log(err);
			$scope.loader = false;
		})
	}
	$scope.init = function(){
		$scope.getAllCompetitions();
		$scope.showData = false;
		$scope.showLeagueTable = false;
	}
	$scope.init();
})