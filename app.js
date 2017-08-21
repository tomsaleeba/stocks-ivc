var app = angular.module('ivc', [])

app.controller('TheController', function ($scope) {
  function doCalc () {
    $scope.grossedUpDivs = $scope.annualDividends / (1 - ($scope.frankingPercentage / 100) * 0.3)
    $scope.normalisedEarnings = $scope.grossedUpDivs + $scope.retainedEarnings + $scope.changeInReserves - $scope.abnormals
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
  $scope.retainedEarnings = 8.2
  $scope.retainedEarningsConfig = {
    title: 'Retained earnings',
    units: '$M',
    tip: 'TODO',
    id: 'retainedEarnings',
    callback: doCalc
  }
  $scope.changeInReserves = -0.9
  $scope.changeInReservesConfig = {
    title: 'Change in reserves',
    units: '$M',
    tip: 'TODO',
    id: 'changeInRes',
    callback: doCalc
  }
  $scope.abnormals = 0
  $scope.abnormalsConfig = {
    title: 'Abnormals',
    units: '$M',
    tip: 'TODO',
    id: 'abnormals',
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
