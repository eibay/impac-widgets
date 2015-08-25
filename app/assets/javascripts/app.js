var invoices_json;

(function () {
    var app = angular.module('maestrano', []);

    app.controller('MainController', ['$scope', '$http', function ($scope, $http) {
        $scope.widgets = items;
        $scope.clicked = -1;

        $scope.addWidget = function (widgetTypeId, isClicked, index) {
            var id;

            if (index >= 0) {
                id = index;
                $("#widget" + index).empty();
            } else if (isClicked) {
                id = $scope.clicked;
            } else {
                id = $scope.getEmptySpace();
            }

            $scope.widgets[id].isEnabled = true;
            $scope.widgets[id].name = $scope.getWidgetTitle(widgetTypeId);
            $scope.widgets[id].type = widgetTypeId;

            $scope.executeWidget(widgetTypeId, id);
        };

        // should reconsider after new widget addition
        $scope.closeWidget = function (id) {
            $scope.widgets[id].name = "";
            $scope.widgets[id].isEnabled = false;

            $('div.move_widget_div' + id).removeClass("move_widget_div" + id).addClass("widget_div" + id);
        };

        $scope.getWidgetTitle = function (id) {
            var name = "";
            switch (id) {
                case 0:
                case 1:
                    name = "Employees location";
                    break;
                case 2:
                case 3:
                case 4:
                    name = "Sales flow";
                    break;
            }
            return name;
        };

        $scope.clickedPanel = function (id) {
            $scope.clicked = id;
        };

        $scope.getEmptySpace = function () {
            for (var i = 0; i < items.length; i++) {
                if (!items[i].isEnabled) {
                    return i;
                }
            }
            return -1;
        };

        $scope.executeWidget = function (widgetTypeId, id) {
            $('div.widget_div' + id).removeClass("widget_div" + id).addClass("move_widget_div" + id);
            switch (widgetTypeId) {
                case 0:
                    initMap(id);
                    break;
                case 1:
                    drawChart(id);
                    break;
                case 2:
                    if (invoices_json)
                        drawCountriesMap(id, invoices_json);
                    else
                        $scope.getJSON(widgetUrls[1], id, drawCountriesMap);
                    break;
                case 3:
                    if (invoices_json)
                        drawMarkersMap(id, invoices_json);
                    else
                        $scope.getJSON(widgetUrls[1], id, drawMarkersMap);
                    break;
                case 4:
                    if (invoices_json)
                        drawPieChart(id, invoices_json);
                    else
                        $scope.getJSON(widgetUrls[1], id, drawPieChart);
                    break;
            }
        };

        $scope.getJSON = function (uri, id, functionCallback) {
            $http({
                method: 'GET',
                url: uri
            }).
                then(function (success) {
                    invoices_json = success.data;
                    functionCallback(id, success.data);
                }, function (failure) {
                    console.log = "JSON request failed: " + failure;
                });
        };
    }]);

    app.directive('widget', function(){
        return {
            restrict: "E",
            templateUrl: "widget.html"
        }
    });

    var items = [
        {
            name: "",
            type: -1,
            isEnabled: false
        },
        {
            name: "",
            type: -1,
            isEnabled: false
        }
    ];

    var widgetUrls = [
        "/employees",
        "/invoices"
    ];
})();