// Generated by CoffeeScript 1.8.0
(function() {
  'user strict';
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('continue.models', ['restmod', 'continue.auth']).config(function(restmodProvider) {
    return restmodProvider.rebase({
      $config: {
        primaryKey: "id",
        style: "ams",
        urlPrefix: "/app/"
      }
    });
  }).factory("Model", [
    'restmod', "Alert", "Auth", function(restmod, Alert, Auth) {
      var copy, next_page, prev_page, save;
      save = function(self, successHandler, errorHandler) {
        if (!self.is_valid()) {
          Alert.show_error("Your input contains invalid data.");
          return false;
        }
        self.loading = true;
        if ("pre_save_handler" in self) {
          self.pre_save_handler();
        }
        Alert.show_msg("Saving your data to database ...");
        return self.$save().$then(function(response) {
          if (self.tags_handler != null) {
            self.tags_handler();
          }
          if (successHandler != null) {
            successHandler(self, response);
          }
          Alert.show_msg("Your data is saved! You may need to refresh ...");
          return self.loading = false;
        }, function(errors) {
          self.loading = false;
          Alert.show_error("There are problems processing your data.", 10000);
          if (errorHandler != null) {
            return errorHandler(self, errors);
          }
        });
      };
      next_page = function(self) {
        var refresh;
        Alert.show_msg("Loading ...");
        refresh = self.$refresh({
          page: self.page + 1,
          num_of_records: self.num_of_records
        });
        return refresh.$asPromise().then(function(response) {
          self.page += 1;
          return this.promise;
        }, function(error) {
          return Alert.show_msg("That's all the items.");
        });
      };
      prev_page = function(self) {
        var refresh;
        Alert.show_msg("Loading ...");
        if (self.page > 1) {
          refresh = self.$refresh({
            page: self.page - 1,
            num_of_records: self.num_of_records
          });
          return refresh.$then(function(response) {
            return self.page -= 1;
          });
        }
      };
      copy = function(self, obj) {
        "Copy properties of <obj> to the record itself.";
        var key;
        if ((obj == null) || typeof obj !== "object") {
          return obj;
        }
        for (key in obj) {
          self[key] = obj[key];
        }
        return self;
      };
      return {
        create: function(path) {
          return restmod.model(path).mix({
            $extend: {
              Record: {
                loading: false,
                save: function(successHandler, errorHandler) {
                  return save(this, successHandler, errorHandler);
                },
                copy: function(obj, property) {
                  if (property == null) {
                    return copy(this, obj);
                  } else {
                    if (property in obj) {
                      this[property] = obj[property];
                    }
                    return this;
                  }
                },
                tags_handler: function() {
                  if (this.tags != null) {
                    if (typeof this.tags === "string") {
                      if (this.tags) {
                        return this.tags = this.tags.split(",");
                      } else {
                        return this.tags = [];
                      }
                    }
                  }
                }
              },
              Collection: {
                path: path,
                loading: false,
                page: 1,
                start: 0,
                num_of_records: 2,
                next_page: function() {
                  return next_page(this);
                },
                prev_page: function() {
                  return prev_page(this);
                },
                fetch: function(params) {
                  var self;
                  self = this;
                  this.loading = true;
                  return this.$fetch(params).$then(function(response) {
                    if (response.tags_handler != null) {
                      return response.tags_handler();
                    }
                  });
                },
                tags_handler: function() {
                  var record, _i, _len, _results;
                  _results = [];
                  for (_i = 0, _len = this.length; _i < _len; _i++) {
                    record = this[_i];
                    _results.push(record.tags_handler());
                  }
                  return _results;
                }
              },
              Model: {
                transform: function(obj) {
                  var record;
                  record = this.$build(this.init);
                  return record.copy(obj);
                },
                search: function(params) {
                  this.loading = true;
                  return this.$search(params).$then(function(response) {
                    if (response.tags_handler != null) {
                      return response.tags_handler();
                    }
                  });
                }
              }
            }
          });
        }
      };
    }
  ]).factory('Post', [
    "$q", "Model", "Item", "Auth", function($q, Model, Item, Auth) {
      var add_item, condition_choices, init, is_valid, search;
      condition_choices = ["New", "Like new", "Good", "Functional", "Broken"];
      init = {
        title: "",
        area: "",
        detail: "",
        items: [],
        is_new: true
      };
      add_item = function(self) {
        var item;
        if ('items' in self) {
          item = Item.$build(Item.init);
          item.owner = Auth.get_user().user_id;
          item.is_new = true;
          self['items'].push(item);
          return item;
        }
      };
      is_valid = function(self) {
        var item, _i, _len, _ref;
        if (!self.title || !self.area) {
          return false;
        }
        _ref = self.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item.title.length === 0) {
            return false;
          }
        }
        return true;
      };
      search = function(self, params) {
        var $then, posts;
        posts = self.$search(params);
        return $then = posts.$then(function(response) {
          var i, item, post, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = posts.length; _i < _len; _i++) {
            post = posts[_i];
            if ("tags" in post) {
              if (typeof post.tags === "string") {
                if (post.tags) {
                  post.tags = post.tags.split(",");
                } else {
                  post.tags = [];
                }
              }
            }
            _results.push((function() {
              var _j, _ref, _results1;
              _results1 = [];
              for (i = _j = 0, _ref = post.items.length; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
                item = post.items[i];
                post.items[i] = Item.transform(item);
                if ("tags" in item) {
                  if (typeof item.tags === "string") {
                    if (item.tags) {
                      _results1.push(item.tags = item.tags.split(","));
                    } else {
                      _results1.push(item.tags = []);
                    }
                  } else {
                    _results1.push(void 0);
                  }
                } else {
                  _results1.push(void 0);
                }
              }
              return _results1;
            })());
          }
          return _results;
        });
      };
      return Model.create('/posts/').mix({
        $extend: {
          Record: {
            add_item: function() {
              return add_item(this);
            },
            is_valid: function() {
              return is_valid(this);
            },
            initialize: function() {
              return initialize(this);
            }
          },
          Model: {
            search: function(params) {
              return search(this, params);
            },
            init: init
          }
        }
      });
    }
  ]).factory("Item", [
    "Model", function(Model) {
      var availability_choices, condition_choices, init, is_valid, utilization_choices, visibility_choices;
      condition_choices = ["New", "Like new", "Good", "Functional", "Broken"];
      visibility_choices = ["Public", "Private", "Ex-owners"];
      availability_choices = ["Available", "In use", "Lent", "Given away", "Disposed"];
      utilization_choices = ["Frequent", "Sometimes", "Rarely", "Never"];
      init = {
        title: "",
        quantity: 1,
        condition: "Good",
        utilization: "Sometimes",
        visibility: "Private",
        availability: "Available",
        status: "",
        new_status: "",
        expanded: false,
        is_new: false
      };
      is_valid = function(self) {
        if (!self.title) {
          false;
        }
        return true;
      };
      return Model.create("/items/").mix({
        $extend: {
          Record: {
            condition_choices: condition_choices,
            availability_choices: availability_choices,
            visibility_choices: visibility_choices,
            utilization_choices: utilization_choices,
            initialize: function() {
              return initialize(this);
            },
            is_valid: function() {
              return is_valid(this);
            },
            pre_save_handler: function() {
              var self;
              self = this;
              if ("new_owner" in self) {
                if (self["new_owner"]) {
                  self.owner = self['new_owner'].id;
                  self.visibility = "Ex-owners";
                }
              }
              if (self.new_status) {
                self.status = self.new_status;
              }
              if ("tags" in self) {
                if (typeof self.tags === "object") {
                  self.tags = self.tags.join(",");
                }
              }
              if ("tags_private" in self) {
                if (typeof self.tags_private === "object") {
                  return self.tags_private = self.tags_private.join(",");
                }
              }
            },
            tags_handler: function() {
              var tag;
              if ("tags" in this) {
                if (!this.tags) {
                  this.tags = [];
                  this.tags_input = [];
                }
                if (typeof this.tags === "string") {
                  if (this.tags) {
                    this.tags = this.tags.split(",");
                    this.tags_input = [
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
                }
              }
              if ("tags_private" in this) {
                if (!this.tags_private) {
                  this.tags_private = [];
                  this.tags_private_input = [];
                }
                if (typeof this.tags_private === "string") {
                  if (this.tags_private) {
                    this.tags_private = this.tags_private.split(",");
                    return this.tags_private_input = [
                      (function() {
                        var _i, _len, _ref, _results;
                        _ref = this.tags_private;
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
                }
              }
            }
          },
          Model: {
            init: init
          }
        },
        histories: {
          hasMany: "History"
        }
      });
    }
  ]).factory("History", [
    "Model", function(Model) {
      return Model.create("/histories/");
    }
  ]).factory("Feed", [
    "Model", function(Model) {
      return Model.create("/feeds/").mix({
        $extend: {
          record: ""
        }
      });
    }
  ]).factory("Timeline", [
    "Model", function(Model) {
      return Model.create("/timeline/").mix({
        $extend: {
          record: ""
        }
      });
    }
  ]).factory("Transaction", [
    "Model", function(Model) {
      return Model.create("/transactions/").mix({
        $hooks: {
          "before-request": function(_req) {
            return _req.url += "/";
          }
        },
        $extend: {
          Record: {
            is_valid: function() {
              return true;
            },
            pre_save_handler: function() {
              this.giver = this.giver.id;
              this.receiver = this.receiver.id;
              return this.item = this.item.id;
            },
            revoke: function() {
              this.status = "Revoked";
              return this.save().$then(function() {
                return location.reload();
              });
            },
            dismiss: function() {
              this.status = "Dismissed";
              return this.save().$then(function() {
                return location.reload();
              });
            },
            receive: function() {
              this.status = "Received";
              return this.save().$then(function() {
                return location.reload();
              });
            }
          }
        }
      });
    }
  ]).factory("InfiniteScroll", function() {
    var InfiniteScroll;
    return InfiniteScroll = (function() {
      InfiniteScroll.prototype.model_types = [];

      InfiniteScroll.prototype.init_starts = void 0;

      InfiniteScroll.prototype.monitor = 0;

      function InfiniteScroll(Model) {
        this.success_handler = __bind(this.success_handler, this);
        this.load = __bind(this.load, this);
        this.config = __bind(this.config, this);
        this.Model = Model;
      }

      InfiniteScroll.prototype.config = function(configs) {
        var cf, _results;
        _results = [];
        for (cf in configs) {
          _results.push(this[cf] = configs[cf]);
        }
        return _results;
      };

      InfiniteScroll.prototype.base_tags_handler = function(parent) {
        if (parent.tags != null) {
          if (parent.tags_handler != null) {
            return parent.tags_handler();
          } else {
            if (typeof parent.tags === "string" && parent.tags.length > 0) {
              return parent.tags = parent.tags.split(",");
            } else {
              return parent.tags = [];
            }
          }
        }
      };

      InfiniteScroll.prototype.load = function(model) {
        if (model == null) {
          if (this.model_types.length > 1) {
            return this.Model.search({
              starts: this.init_starts
            });
          } else {
            return this.Model.search({
              start: this.init_starts
            });
          }
        } else {
          if (this.model_types.length > 1) {
            return model.fetch({
              starts: model.starts
            });
          } else {
            return model.fetch({
              start: model.start
            });
          }
        }
      };

      InfiniteScroll.prototype.success_handler = function(response) {
        var item, model_name, record, _i, _j, _len, _len1, _ref;
        if (this.model_types.length === 1) {
          response.start = parseInt(this.init_starts) + response.length;
          if (response.tags_handler != null) {
            response.tags_handler();
          }
        } else if (this.model_types.length > 1) {
          response.starts = {};
          for (model_name in this.init_starts) {
            response.starts[model_name] = this.init_starts[model_name];
          }
          for (_i = 0, _len = response.length; _i < _len; _i++) {
            record = response[_i];
            model_name = record.model_name;
            response.starts[model_name] += 1;
            if (record.items != null) {
              if (record.items) {
                _ref = record.items;
                for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                  item = _ref[_j];
                  this.base_tags_handler(item);
                }
              }
            }
          }
        }
        return response;
      };

      return InfiniteScroll;

    })();
  });

}).call(this);
