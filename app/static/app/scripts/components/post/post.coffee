angular.module "continue"

.controller "postCtrl", ["$scope", "Post", "ItemSelector", "ItemEditor", ($scope, Post, ItemSelector, ItemEditor)->
  $scope.new_items = []
  $scope.post = Post.$build(Post.init)
  $scope.layout = {
    detail_input: false
  }
  # If 'id' is specified, load the post from server.
  $scope.$watch "id", ()->
    if $scope.id?
      $scope.post = Post.$find($scope.id)
      $scope.post.$then (response)->
        tags = response.tags.split(",")
        $('textarea').val($scope.post.detail).trigger('autosize.resize')
        if $scope.post.tags
          $scope.tags_input = [{"text": tag} for tag in tags][0]

  $scope.show_detail_editor = ()->
    $scope.layout.detail_input = true
    
  $scope.select_item = ()->
    ItemSelector.begin($scope.post.items).then (response)->
      if response
        $scope.post.items.push(response)
        $scope.new_items.push(response)

  $scope.add_new_item = ()->
    ItemEditor.begin().then (response)->
      if response
        $scope.post.items.push(response)
        $scope.new_items.push(response)

  $scope.save = ()->
    tags_array = [tag.text for tag in $scope.tags_input]
    tags = tags_array.join(",")
    $scope.post.tags = tags
    $scope.post.save().$then (response)->
      if "id" of response
        window.location.replace("/app/post/#{response.id}/")

]