var data_json;

(function() {
  var app = angular.module('maestrano', []);

  app.controller('MainController', ['$scope', '$http', function($scope, $http) {
    $scope.widgets = items;
      $scope.clicked = -1;

    $scope.addWidget = function(type, isClicked) {
        var id;
        if (isClicked) {
            id = $scope.clicked;
        } else {
            id = $scope.getEmptySpace();
        }

        $scope.widgets[id].isEnabled = true;
        $scope.widgets[id].name = widgetNames[type];
        $scope.widgets[id].type = type;
        $scope.getSampleJSON(widgetUrls[type], id);
        $('div.map_region' + id).removeClass("map_region" + id).addClass("move_map" + id);
    };

    $scope.addWidgetToPanel = function(type) {
        var clickedId = $scope.clicked;
      $scope.widgets[clickedId].isEnabled = true;
      $scope.widgets[clickedId].name = widgetNames[type];
      $scope.widgets[clickedId].type = type;
      $scope.getSampleJSON(widgetUrls[type], clickedId);
        console.log("addWidgetToPanel");
        $('div.map_region' + clickedId).removeClass("map_region" + clickedId).addClass("move_map" + clickedId);
    };

    $scope.closeWidget = function(id) {
      $scope.widgets[id].name = "";
      $scope.widgets[id].isEnabled = false;
        $('div.move_map' + id).removeClass("move_map" + id).addClass("map_region" + id);
    };

    $scope.getWidgetTitle = function(title) {
      if (!isNaN(title)) {
        return "Widget #" + title;
      } else {
        return '"' + title + '" widget';
      }
    };

    $scope.clickedPanel = function(id) {
      $scope.clicked = id;
    };

    $scope.getEmptySpace = function() {
      for (var i = 0; i < items.length; i++) {
        if (!items[i].isEnabled) {
          return i;
        }
      }
      return -1;
    };


    $scope.getSampleJSON = function(uri, id) {
      $scope.widgets[id].body = "";
      $http({method: 'GET', 
        url: uri }).
        then(function(success) {
          $scope.widgets[id].body = success.data;
              data_json = success.data;
              initMap(id);
        }, function(failure) {
          $scope.widgets[id].body = "JSON request failed: " + failure;
        });
    };
  }]);

  var items = [
    {
      name: "",
      body: "",
      type: -1,
      isEnabled: false
    },
    {
      name: "",
      body: "",
      type: -1,
      isEnabled: false
    }
  ];

  var widgetNames = [
    "Employees location",
    "Sales flow"
  ];

  var widgetUrls = [
    "/employees",
    "/invoices"
  ];
})();