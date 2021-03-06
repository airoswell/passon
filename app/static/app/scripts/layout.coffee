# Enable [tab] to indent
textareas = document.getElementsByTagName("textarea")
count = textareas.length
i = 0

while i < count
  textareas[i].onkeydown = (e) ->
    if e.keyCode is 9 or e.which is 9
      e.preventDefault()
      s = @selectionStart
      @value = @value.substring(0, @selectionStart) + "\t" + @value.substring(@selectionEnd)
      @selectionEnd = s + 1
    return
  i++

# Auto resize all textarea
$(document).ready ()->
  $('textarea').autosize()
  console.log $("textarea")
# ============================
angular.module "worldsheet"

.controller "LayoutCtrl", [
  "$scope"
  "Auth"
  "Alert"
  ($scope, Auth, Alert) ->

    $scope.search = ()->
      # Search from the dropdown search panel in the navbar
      areas = $scope.tags_to_string($scope.areas_tags)
      tags = $scope.tags_to_string($scope.tags_tags)
      console.log tags
      $("input[name=areas]").val(areas)
      $("input[name=tags]").val(tags)
      console.log $("input[name=tags]").val()
      console.log "$('input[name='q']')", $("input[name='q']")
      document.getElementById('search-form').submit()
      # clear the input to prevent going back and see the input
      $("input").val("")
      return

    $scope.tags_to_string = (input_tags)->
      console.log "tags_to_string", input_tags
      if input_tags
        areas = [tag.text for tag in input_tags]
        areas = areas.join(",")
        return areas
      return ""
    
    $("input[name='q'], input[name='secret_key']").keyup (e)->
      if e.which == 13
        $scope.search()
      return

    $scope.profile = {}
    $scope.scrollTop = 0
    angular.element($(window)).bind "scroll", ()->
      $scope.scrollTop = $(window).scrollTop()
      $scope.$apply()

    # Initialize user_info and modal data
    Auth.fetch_profile().then (response)->
      Auth.store_profile(response[0])
      $scope.profile = Auth.get_profile()
      profile = $scope.profile
      if not profile.is_anonymous
        $scope.primary_area = profile.primary_area
        if profile.interested_areas
          $scope.interested_areas_array = profile.interested_areas.split(",")
          $scope.interested_areas_tags = [{text: tag} for tag in $scope.interested_areas_array][0]
        $scope.photo = profile.social_account_photo

]


.filter "truncate", ()->
  return (input, max)->
    return input.slice(0, max)


# For pending transaction processing at the nav-bar
.directive "transaction", ["Transaction", (Transaction)->
  restrict: "A"
  scope: true
  link: (scope, element, attrs)->
    transaction_id = attrs["transactionId"]
    scope.transaction = Transaction.$find(transaction_id)
]