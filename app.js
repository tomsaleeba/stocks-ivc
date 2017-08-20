var app = angular.module('ivc', [])

app.controller('TheController', function ($scope) {
  function doCalc () {
    $scope.grossedUpDivs = roundTo2Places($scope.annualDividends / (1 - ($scope.frankingPercentage / 100) * 0.3))
  }
  $scope.annualDividends = 19.107
  $scope.annualDividendsConfig = {
    title: 'Annual dividends',
    units: 'cents',
    tip: 'Total dividends paid for the FY in AUD cents',
    id: 'annualDivs',
    callback: doCalc
  }
  $scope.frankingPercentage = 100
  $scope.frankingPercentageConfig = {
    title: 'Franking percentage',
    units: '%',
    tip: 'TODO',
    id: 'frankingPct',
    callback: doCalc
  }
  $scope.doCalc = doCalc
  $scope.doCalc()
})

app.directive('ivcInput', function () {
  return {
    templateUrl: './ivcInput-template.html',
    replace: true,
    scope: {
      ivcModel: '=',
      ivcConfig: '<'
    },
    link: function (scope, element, attrs) { }
  }
})

function roundTo2Places (val) {
  return Math.round(val * 100) / 100
}
