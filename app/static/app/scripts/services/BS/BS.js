// Generated by CoffeeScript 1.8.0
(function() {
  angular.module("continue").factory("BS", [
    "$q", function($q) {
      var templateUrls;
      templateUrls = {
        "item-detail": "/static/app/directives/dashboard-item-overview.html",
        "album": "/static/app/scripts/services/album/album.html",
        "private-message": "/static/app/scripts/services/private-message/private-message.html",
        "item-editor": "/static/app/directives/item-editor.html",
        "item-selector": "/static/app/directives/item-selector.html"
      };
      return {
        contentUrl: "",
        monitor: 0,
        promise: void 0,
        deferred: void 0,
        output: void 0,
        input: void 0,
        bringUp: function(content_type) {
          "Return a <deferred object>. Other services can call BS.bringUp()\nand resolve it when appropriate.\nBS do not store content data for the bottom-sheet. All data\nshould be provided by the calling service, and controller \nthat control the content, specified by the <content_type>";
          var deferred, self;
          self = this;
          self.is_show = true;
          self.contentUrl = templateUrls[content_type];
          deferred = $q.defer();
          deferred.promise.then(function() {
            return self.is_show = false;
          });
          self.promise = deferred.promise;
          self.deferred = deferred;
          self.monitor += 1;
          return deferred;
        },
        close: function() {
          this.is_show = false;
          this.deferred.resolve();
          return this.deferred.promise;
        }
      };
    }
  ]).directive("bS", [
    "BS", function(BS) {
      return {
        restrict: "E",
        templateUrl: "/static/app/scripts/services/BS/BS.html",
        link: function(scope, element, attrs) {
          scope.BS = BS;
          return scope.$watch("BS.monitor", function() {
            return scope.contentUrl = BS.contentUrl;
          });
        }
      };
    }
  ]).factory("ItemEditor", [
    "Item", "BS", function(Item, BS) {
      return {
        item: {},
        monitor: 0,
        deferred: {},
        refresh: false,
        begin: function(input, refresh) {
          var self;
          self = this;
          if (refresh != null) {
            self.refresh = refresh;
          }
          if (input != null) {
            if (typeof input === "string") {
              self.item = Item.$find(input);
              return self.item.$then(function(response) {
                console.log("self.item.tags_handler");
                self.item.tags_handler();
                self.deferred = BS.bringUp("item-editor");
                self.monitor += 1;
                console.log("self.deferred.promise", self.deferred.promise);
                return self.deferred.promise;
              }).$asPromise();
            } else if (typeof input === "object") {
              self.item = input;
              self.item.is_new = true;
              self.item.visibility = "Public";
              self.deferred = BS.bringUp("item-editor");
              self.monitor += 1;
              console.log("self.deferred.promise", self.deferred.promise);
              return self.deferred.promise;
            }
          } else {
            self.item = Item.$build(Item.init);
            self.item.is_new = true;
            self.item.visibility = "Public";
            self.deferred = BS.bringUp("item-editor");
            self.monitor += 1;
            return self.deferred.promise;
          }
        }
      };
    }
  ]).directive("itemEditor", [
    "ItemEditor", function(ItemEditor) {
      return {
        restrict: "AE",
        link: function(scope, element, attrs) {
          scope.ItemEditor = ItemEditor;
          scope.$watch("ItemEditor.monitor", function() {
            return scope.item = ItemEditor.item;
          });
          scope.add_to_post = function() {
            ItemEditor.deferred.resolve(scope.item);
            ItemEditor.item = {};
            return scope.item = {};
          };
          return scope.update_item = function(item) {
            ItemEditor.deferred.resolve(item);
            return item.save().$then(function(response) {
              return scope.item = {};
            });
          };
        }
      };
    }
  ]).factory("ItemSelector", [
    "Item", "BS", function(Item, BS) {
      return {
        items: [],
        deferred: {},
        monitor: 0,
        existed_items: {},
        begin: function(existed_items) {
          var self;
          self = this;
          self.existed_items = existed_items;
          self.items = Item.$search({
            page: 1,
            num_of_records: 8
          });
          return self.items.$asPromise().then(function(response) {
            console.log("ItemSelector tags_handler()");
            self.items.tags_handler();
            self.deferred = BS.bringUp("item-selector");
            self.monitor += 1;
            console.log("self.items ========>", self.items);
            return self.deferred.promise;
          });
        }
      };
    }
  ]).directive("itemSelector", [
    "ItemSelector", function(ItemSelector) {
      return {
        restrict: "AE",
        link: function(scope) {
          scope.ItemSelector = ItemSelector;
          scope.select = function(item) {
            return ItemSelector.deferred.resolve(item);
          };
          scope.$watch("ItemSelector.monitor", function() {
            scope.items = ItemSelector.items;
            scope.existed_items = ItemSelector.existed_items;
            return scope.items.num_of_records = 8;
          });
          return scope.duplicated = function(item) {
            var duplicated, existed, _i, _len, _ref;
            duplicated = false;
            _ref = scope.existed_items;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              existed = _ref[_i];
              if (item.id === existed.id) {
                duplicated = true;
              }
            }
            return duplicated;
          };
        }
      };
    }
  ]);

}).call(this);
