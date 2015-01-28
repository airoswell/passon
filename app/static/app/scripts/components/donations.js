// Generated by CoffeeScript 1.8.0
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  console.log("donations");

  angular.module("continue").controller("donationsCtrl", [
    "$scope", "Item", "BulkItems", "Alert", function($scope, Item, BulkItems, Alert) {
      $scope.layout = {
        display_tab: 0
      };
      $scope.bulk_items = BulkItems.$build();
      $scope.items = [];
      $scope.items_title = [];
      $scope.items_tag = [];
      $scope.customized_num_fields = [
        {
          title: "Age",
          unit: "year",
          value: 0
        }
      ];
      $scope.customized_char_fields = [
        {
          title: "Donor's name",
          value: ""
        }, {
          title: "Donor's area",
          value: ""
        }, {
          title: "Donor's phone",
          value: ""
        }, {
          title: "Donor's email",
          value: ""
        }
      ];
      $scope.$watch("items_tag", function() {
        var item, tag, _i, _len, _ref, _ref1, _results;
        _ref = $scope.items_tag;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tag = _ref[_i];
          if (!(_ref1 = tag.text, __indexOf.call($scope.items_title, _ref1) >= 0)) {
            item = Item.$build(Item.init);
            item.title = tag.text;
            item.owner = 5;
            item.type = "donation";
            $scope.items.push(item);
            $scope.items_title.push(item.title);
          }
          _results.push($scope.step_one_done = true);
        }
        return _results;
      }, true);
      $scope.$watch("items", function(newVal) {
        return $('textarea').autosize();
      }, true);
      $scope.is_valid = function() {
        var is_valid, pat;
        if (!$scope.contactForm.$valid) {
          Alert.show_msg("Please fill in your name and area");
          return false;
        }
        if (!$scope.customized_char_fields[2].value && !$scope.customized_char_fields[3].value) {
          Alert.show_msg("Please provide either your phone number or your email address.");
          return false;
        } else if (!$scope.customized_char_fields[3].value) {
          pat = /\d{3}[^0-9]*\d{3}[^0-9]*\d{4}$/;
          is_valid = pat.test($scope.customized_char_fields[2].value);
          if (!is_valid) {
            Alert.show_msg("Please provide valid phone number");
            return false;
          }
        }
        return true;
      };
      return $scope.submit = function() {
        var item, _i, _len, _ref;
        console.log("submitting");
        if (!$scope.is_valid()) {
          return;
        }
        _ref = $scope.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          console.log("appending item");
          item.customized_char_fields = $scope.customized_char_fields;
        }
        $scope.bulk_items.items = $scope.items;
        Alert.show_msg("Submitting your data ...");
        return $scope.bulk_items.$save().$then(function(response) {
          console.log(response);
          return Alert.show_msg("Successfully submitted your data.");
        });
      };
    }
  ]);

}).call(this);
