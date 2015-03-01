// Generated by CoffeeScript 1.8.0
(function() {
  angular.module("continue").controller("activitySignUpCtrl", [
    "$scope", "$q", "Alert", "Attendant", function($scope, $q, Alert, Attendant) {
      var unwatch;
      $scope.is_comming = "Yes";
      $scope.level = "Inapplicable";
      $scope.layout = {
        filter: "",
        submitting: false,
        submited: false
      };
      $scope.fields = Attendant.fields();
      $scope.load_fields = function() {
        var deferred;
        deferred = $q.defer();
        console.log(deferred);
        deferred.resolve($scope.fields);
        return deferred.promise;
      };
      $scope.new_attendants = [];
      unwatch = $scope.$watch("date", function() {
        $scope.date = new Date($scope.date + " EST");
        console.log("$scope.date", $scope.date);
        return unwatch();
      });
      $scope.$watch("activity", function() {
        return Attendant.statistics($scope.activity, $scope.date).$then(function(response) {
          return $scope.statistics = response[0];
        });
      });
      $scope.submit = function() {
        var attendant, fields, tag;
        if ($scope.layout.submitting) {
          Alert.show_msg("We are submitting your registration. Please wait.");
        }
        fields = [
          (function() {
            var _i, _len, _ref, _results;
            _ref = $scope.interested_in_fields_tags;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              tag = _ref[_i];
              _results.push(tag.text);
            }
            return _results;
          })()
        ].join(",");
        console.log("fields", fields);
        attendant = Attendant.$build({
          name: $scope.name,
          email: $scope.email,
          is_comming: $scope.is_comming,
          level: $scope.level,
          department: $scope.department,
          activity: $scope.activity,
          date: $scope.date,
          fields: fields
        });
        $scope.layout.submitting = true;
        return attendant.save().$then(function(response) {
          $scope.new_attendants.push(response);
          $scope.fields = Attendant.fields();
          Attendant.statistics($scope.activity, $scope.date).$then(function(response) {
            return $scope.statistics = response[0];
          });
          return $scope.layout.submited = true;
        });
      };
      return $scope.filter = function(decision) {
        if ($scope.layout.filter === decision) {
          return $scope.layout.filter = "";
        } else {
          return $scope.layout.filter = decision;
        }
      };
    }
  ]);

}).call(this);
