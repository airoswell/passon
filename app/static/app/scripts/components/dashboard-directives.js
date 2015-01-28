// Generated by CoffeeScript 1.8.0
(function() {
  angular.module("continue").directive("itemEditorPro", [
    "Alert", "Album", "Auth", "$upload", "settings", function(Alert, Album, Auth, $upload, settings) {
      return {
        restrict: "E",
        templateUrl: "/static/app/directives/item-editor-pro.html",
        scope: true,
        link: function(scope) {
          scope.show_more = false;
          $('textarea').autosize();
          scope.$watch("files", function() {
            if (scope.files) {
              return scope.upload = $upload.upload({
                url: "/app/images/",
                data: {
                  owner: Auth.get_profile().user_id
                },
                file: scope.files
              }).progress(function(evt) {
                console.log("progress: " + parseInt(100.0 * evt.loaded / evt.total) + "% file :" + evt.config.file.name);
              }).then(function(response) {
                var item, url_abs, url_rel;
                url_rel = response.data.url;
                url_abs = "" + settings.UPLOADED_URL + url_rel;
                item = scope.item;
                item.pic = url_abs;
                return scope.save(item);
              }, function() {
                return Alert.show_error("There was problem uploading your file. Please make sure your file is a valid image file.");
              });
            }
          });
          scope.save = function(item) {
            var success_handler, tag, tags, tags_private;
            tags = [
              (function() {
                var _i, _len, _ref, _results;
                _ref = item.tags_input;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  tag = _ref[_i];
                  _results.push(tag.text);
                }
                return _results;
              })()
            ][0].join(",");
            tags_private = [
              (function() {
                var _i, _len, _ref, _results;
                _ref = item.tags_private_input;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  tag = _ref[_i];
                  _results.push(tag.text);
                }
                return _results;
              })()
            ][0].join(",");
            item.tags = tags;
            item.tags_private = tags_private;
            success_handler = function(item) {
              item.expanded = false;
              return item.new_status = "";
            };
            return item.save(success_handler).$asPromise();
          };
          scope.expand = function(item) {
            if (item.expanded !== true) {
              console.log("expand");
              item.expanded = true;
            } else {
              console.log("fold");
              item.expanded = false;
            }
          };
          return scope.get_albums = function(item) {
            Alert.show_msg("Downloading your albums ...");
            return Album.get_albums().then(function(response) {
              if (response) {
                item.pic = response;
                return item.save();
              }
            });
          };
        }
      };
    }
  ]).directive("itemEditorProTitle", function() {
    return {
      restrict: "E",
      templateUrl: "/static/app/directives/item-editor-pro-title.html"
    };
  }).directive("itemEditorProBasics", function() {
    return {
      restrict: "E",
      templateUrl: "/static/app/directives/item-editor-pro-basics.html"
    };
  }).directive("itemEditorProMore", function() {
    return {
      restrict: "E",
      templateUrl: "/static/app/directives/item-editor-pro-more.html"
    };
  }).directive("itemFieldEditMenu", function() {
    return {
      restrict: "E",
      templateUrl: "/static/app/directives/item-field-edit-menu.html",
      link: function(scope) {
        return console.log(scope.item);
      }
    };
  }).directive("postOverview", function() {
    return {
      restrict: "E",
      templateUrl: "/static/app/directives/post-overview.html"
    };
  }).directive("dashboardItemOverview", [
    "Album", "Alert", function(Album, Alert) {
      return {
        restrict: "E",
        scope: true,
        templateUrl: "/static/app/directives/dashboard-item-overview.html",
        link: function(scope, element, attrs) {
          return element.on("click", function(e) {
            if ("trigger" in e.target.attributes) {
              scope.expand(scope.item);
              return scope.$apply();
            }
          });
        }
      };
    }
  ]).directive("angularItemUpdate", function() {
    return {
      restrict: "E",
      templateUrl: "/static/app/directives/angular-item-update.html"
    };
  }).directive("inputText", function() {
    return {
      restrict: "E",
      templateUrl: "/static/app/directives/input-text.html",
      scope: {
        data: "=",
        label: "=",
        placeHolder: "=",
        inputClass: "=",
        containerClass: "="
      }
    };
  }).directive("inputDropdown", function() {
    return {
      restrict: "E",
      templateUrl: "/static/app/directives/input-dropdown.html",
      scope: {
        data: "=",
        label: "=",
        choices: "=",
        containerClass: "=",
        transfer: "=",
        user: "="
      },
      link: function(scope, element, attrs) {
        scope.dropdown = false;
        element.find("[trigger]").on("click", function() {
          scope.dropdown = true;
          return scope.$apply();
        }).on("mouseleave", function() {
          scope.dropdown = false;
          return scope.$apply();
        });
        return scope.select = function(option) {
          return scope.data = option;
        };
      }
    };
  }).directive("inputTextarea", function() {
    return {
      restrict: "E",
      templateUrl: "/static/app/directives/input-textfield.html",
      scope: {
        data: "=",
        label: "=",
        containerClass: "@",
        inputClass: "@",
        placeHolder: "="
      }
    };
  }).directive("inputDate", function() {
    return {
      restrict: "E",
      templateUrl: "/static/app/directives/input-date.html",
      scope: {
        date: "=",
        label: "@"
      }
    };
  }).directive("inputNum", function() {
    return {
      restrict: "E",
      templateUrl: "/static/app/directives/input-num.html",
      scope: {
        num: "=",
        label: "@"
      },
      link: function(scope, element) {
        return scope.click = function() {
          element.find("input").focus();
          return true;
        };
      }
    };
  });

}).call(this);
