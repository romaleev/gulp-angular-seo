'use strict';

angular.module('romaleev')
  .factory('util', function() {

    return {
      findByName: function findById(array, name) {
        for (var i = 0; i < array.length; i++) {
          var fullname = array[i].name.last + ', ' + array[i].name.first;
          if (fullname === name) {
            return array[i];
          }
        }
        return null;
      }
    };
  })
  .factory('directories', function($http, util) {
    var path = 'http://beta.json-generator.com/api/json/get/KIUGEFb?callback=JSON_CALLBACK';

    return {
      get: function(name) {
        var all = !arguments.length;
        return $http.jsonp(path).then(function(response) {
          if (all) {
            return response.data;
          }
          return util.findByName(response.data, name);
        }).catch(function(error) {
          console.error(error);
        });
      }
    };
  });