// Generated by CoffeeScript 1.8.0
(function() {
  console.log("post.coffee");

  angular.module("worldsheet").controller("postEditorCtrl", [
    "$scope", "Post", "ItemSelector", "ItemEditor", "Alert", "$upload", "Auth", "settings", function($scope, Post, ItemSelector, ItemEditor, Alert, $upload, Auth, settings) {
      $scope.new_items = [];
      $scope.images_list = [];
      $scope.test_image = "http://localhost:8000/static/uploaded/item_images/ipad_4UnR7b1.jpg";
      $scope.post = Post.$build(Post.init);
      $scope.layout = {
        detail_input: false
      };
      $scope.submission_error = false;
      $scope.$watch("id", function() {
        if ($scope.id != null) {
          $scope.post = Post.$find($scope.id);
          return $scope.post.$then(function(response) {
            var images_url_list, tag, url;
            this.tags_handler();
            $('textarea').val(this.detail).trigger('autosize.resize');
            if (this.tags.length > 0) {
              $scope.tags_input = [
                (function() {
                  var _i, _len, _ref, _results;
                  _ref = this.tags;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    tag = _ref[_i];
                    _results.push({
                      "text": tag
                    });
                  }
                  return _results;
                }).call(this)
              ][0];
            }
            if (this.images) {
              images_url_list = this.images.split(",");
              return $scope.images_list = [
                (function() {
                  var _i, _len, _results;
                  _results = [];
                  for (_i = 0, _len = images_url_list.length; _i < _len; _i++) {
                    url = images_url_list[_i];
                    _results.push({
                      url: url,
                      markdown: "![](" + url + ")"
                    });
                  }
                  return _results;
                })()
              ][0];
            }
          });
        }
      });
      $scope.$watch("images", function() {
        if ($scope.images) {
          return $scope.upload = $upload.upload({
            url: "/app/images/",
            data: {
              owner: Auth.get_profile().id
            },
            file: $scope.images
          }).progress(function(evt) {
            console.log("progress: " + parseInt(100.0 * evt.loaded / evt.total) + "% file :" + evt.config.file.name);
          }).then(function(response) {
            var img, post, url, url_rel;
            console.log(response);
            url_rel = response.data.url;
            url = "" + settings.UPLOADED_URL + url_rel;
            post = $scope.post;
            img = {
              url: url,
              markdown: "![](" + url + ")"
            };
            $scope.images_list.push(img);
            return $scope.images = void 0;
          }, function() {
            return Alert.show_error("There was problem uploading your file. Please make sure your file is a valid image file.");
          });
        }
      });
      $scope.show_detail_editor = function() {
        $scope.layout.detail_input = true;
        $("textarea").resize();
        return true;
      };
      $scope.select_item = function() {
        Alert.show_msg("Loading your items ...");
        return ItemSelector.begin($scope.post.items).then(function(response) {
          if (response) {
            $scope.post.items.push(response);
            return $scope.new_items.push(response);
          }
        });
      };
      $scope.add_new_item = function() {
        return ItemEditor.begin().then(function(response) {
          console.log("haha2 in add_new_item");
          if (response) {
            $scope.post.items.push(response);
            return $scope.new_items.push(response);
          }
        });
      };
      $scope.reset = function() {
        $scope.post.$fetch();
        return $scope.new_items = [];
      };
      return $scope.save = function() {
        var images, img, tag, tags, tags_array;
        if (!$scope.postEditor.$valid) {
          $scope.submission_error = true;
          Alert.show_error("You input maybe incomplete, or invalid.");
          return;
        }
        if ($scope.post.visibility === "Invitation" && !$scope.post.secret_key) {
          $scope.missing_key = true;
        }
        if ($scope.images_list.length) {
          images = [
            (function() {
              var _i, _len, _ref, _results;
              _ref = $scope.images_list;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                img = _ref[_i];
                _results.push(img.url);
              }
              return _results;
            })()
          ].join(",");
          $scope.post.images = images;
        }
        if ($scope.tags_input.length) {
          tags_array = [
            (function() {
              var _i, _len, _ref, _results;
              _ref = $scope.tags_input;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                tag = _ref[_i];
                _results.push(tag.text);
              }
              return _results;
            })()
          ];
          tags = tags_array.join(",");
          $scope.post.tags = tags;
        }
        $scope.post.owner = Auth.get_profile().id;
        return $scope.post.save().$then(function(response) {
          if ("id" in response) {
            return window.location.replace("/app/post/" + response.id + "/");
          }
        }, function(e) {
          return Alert.show_error("There is error saving your post.");
        });
      };
    }
  ]);

}).call(this);
