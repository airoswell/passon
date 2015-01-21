// Generated by CoffeeScript 1.8.0
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  angular.module("continue").factory("PrivateMessage", [
    "restmod", "Auth", "BS", "Alert", "Profile", function(restmod, Auth, BS, Alert, Profile) {
      var PM;
      PM = restmod.model("/user/messages/").mix({
        $hooks: {
          'before-request': function(_req) {
            return _req.url += "/";
          }
        }
      });
      return {
        pm: PM.$build(),
        monitor: 0,
        deferred: {},
        compose: function(owner_id, post_id, items) {
          var profile, self;
          self = this;
          self.monitor += 1;
          self.pm.recipient = owner_id;
          self.pm.recipient_profile = Profile.$find(1, {
            user_id: owner_id
          });
          self.pm.post_id = post_id;
          self.pm.items = items;
          profile = Auth.get_profile();
          if (!profile.is_anonymous) {
            self.pm.sender = profile.user_id;
          } else {
            self.pm.sender = "";
          }
          return self.pm.recipient_profile.$then(function(response) {
            return self.deferred = BS.bringUp("private-message");
          });
        },
        send: function(subject, body) {
          var self;
          self = this;
          Alert.show_msg("Sending your message ...");
          this.pm.subject = subject;
          this.pm.body = body;
          this.pm.$save().$then(function(response) {
            Alert.show_msg("Messages is sent successfully!");
            return self.deferred.resolve();
          });
          return self.deferred.promise;
        }
      };
    }
  ]).controller("privateMessageCtrl", [
    "$scope", "Item", "PrivateMessage", "Alert", function($scope, Item, PrivateMessage, Alert) {
      var item_ids;
      $scope.PrivateMessage = PrivateMessage;
      $scope.items = [];
      item_ids = [];
      $scope.$watch("PrivateMessage.monitor", function() {
        var item_id, _i, _len, _ref;
        if ($scope.post_id == null) {
          $scope.post_id = PrivateMessage.pm.post_id;
        } else if ($scope.post_id !== PrivateMessage.pm.post_id) {
          $scope.items = [];
          item_ids = [];
        }
        _ref = $scope.PrivateMessage.pm.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item_id = _ref[_i];
          if (!(__indexOf.call(item_ids, item_id) >= 0)) {
            item_ids.push(item_id);
            Item.$find(item_id).$then(function(response) {
              return $scope.items.push(response);
            });
          }
        }
        return $scope.recipient_profile = PrivateMessage.pm.recipient_profile;
      });
      return $scope.send = function() {
        if (!PrivateMessage.pm.sender) {
          if ($scope.email) {
            PrivateMessage.pm.email = $scope.email;
          } else {
            Alert.show_msg("Please enter your email address.");
            return;
          }
        }
        return PrivateMessage.send($scope.subject, $scope.body).then(function() {
          $scope.body = void 0;
          return $scope.subject = void 0;
        });
      };
    }
  ]);

}).call(this);
