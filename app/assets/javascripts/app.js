(function() {
  var app = angular.module('maestrano', []);

  app.controller('MainController', ['$scope', '$http', function($scope, $http) {
    $scope.widgets = items;
    $scope.clicked = -1;

    $scope.addWidget = function(type) {
      var idx = $scope.getEmptySpace();
      if (idx != -1) {
        $scope.widgets[idx].isEnabled = true;
        $scope.widgets[idx].name = widgetNames[type];
        $scope.getSampleJSON(widgetUrls[type], idx);
      }
    };

    $scope.addWidgetToPanel = function(type) {
      $scope.widgets[$scope.clicked].isEnabled = true;
      $scope.widgets[$scope.clicked].name = widgetNames[type];
      $scope.getSampleJSON(widgetUrls[type], $scope.clicked);
    };

    $scope.closeWidget = function(id) {
      $scope.widgets[id].name = "";
      $scope.widgets[id].isEnabled = false;
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
      };
      return -1;
    };

    $scope.getSampleJSON = function(uri, id) {
      $scope.widgets[id].body = "";
      $http({method: 'GET', 
        url: uri }).
        then(function(success) {
          $scope.widgets[id].body = success.data;
        }, function(failure) {
          $scope.widgets[id].body = "JSON request failed";
        });
    };
  }]);

  var items = [
    {
      name: "",
      body: "",
      isEnabled: false
    },
    {
      name: "",
      body: "",
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
