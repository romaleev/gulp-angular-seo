'use strict';

angular.module('romaleev')
    .service('peopleService', function($http) {
        var path = 'http://beta.json-generator.com/api/json/get/BghOLRG?callback=JSON_CALLBACK',
            hired = [],
            salaries = {},
            _this = this;

        function get(id) {
            var all = arguments.length === 0 || arguments[0] === undefined;
            return $http.jsonp(path).then(function(response) {
                if (all) {
                    return response.data;
                }
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i]._id == id) return response.data[i];
                }
                return null;
            }).catch(function(error) {
                console.error(error);
            });
        }

        this.getPeople = function() {
            return get().then(function(people) {
                _this.allCount = people.length;
                _this.availableCount = people.length - hired.length;
                return people.map(function(item, i, arr) {
                    salaries[item._id] = item.price;
                    var aboutCut = item.about.substr(0, 99),
                        aboutCutSentence = aboutCut.match(/^[\s\S]*\./); //regexp: cut after last dot
                    return {
                        id: item._id,
                        fullname: item.name.last + ', ' + item.name.first,
                        about: item.about,
                        aboutCut: aboutCutSentence && aboutCutSentence[0].length > 80 ? aboutCutSentence : aboutCut + '...',
                        thumbnail: item.picture.thumbnail,
                        salary: item.price + ',000$',
                        hired: hired.indexOf(item._id) != -1
                    };
                });
            });
        };

        this.getPerson = function(id) {
            return get(id).then(function(person) {
                salaries[id] = person.price;
                return {
                    Name: '<span class="bold">' + person.name.first + ' ' + person.name.last + '</span>',
                    About: person.about,
                    Picture: '<img class="img-circle img-thumbnail" src="' + person.picture.large + '" />',
                    ID: '<span class="alert alert-danger">' + person._id + '</span>',
                    Email: person.email,
                    Phone: person.phone,
                    Address: person.address,
                    Salary: '<span class="text-primary">' + person.price + ',000$</span>'
                };
            });
        };

        this.hire = function(id) {
            var index = hired.indexOf(id);
            if (index === -1) {
                hired.push(id);
                this.hiredSum += salaries[id];
            } else {
                hired.splice(index, 1);
                this.hiredSum -= salaries[id];
            }
            this.hiredCount = hired.length;
            this.availableCount = this.allCount - hired.length;

            return index === -1;
        };

        this.isHired = function(id){
            return hired.indexOf(id) != -1;
        };

        this.allCount = 0;
        this.availableCount = 0;
        this.hiredCount = 0;
        this.hiredSum = 0;
    });
