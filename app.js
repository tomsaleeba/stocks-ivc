var app = angular.module('ivc', [])

app.controller('TheController', function ($scope) {
  function doCalc () {
    $scope.grossedUpDivs = $scope.annualDividends / (1 - ($scope.frankingPercentage / 100) * 0.3)
    $scope.normalisedEarnings = $scope.grossedUpDivs + $scope.retainedEarnings + $scope.changeInReserves - $scope.abnormals
    $scope.nroe = $scope.normalisedEarnings / ($scope.openingEquity + ($scope.newNetOrdinaryEquity/2))
    $scope.payoutRatio = $scope.grossedUpDivs / $scope.normalisedEarnings
    $scope.payoutRatioPercentage = $scope.payoutRatio * 100
    $scope.bondComponent = $scope.nroe / ($scope.requiredReturn / 100)
    $scope.growthComponent = (Math.pow($scope.nroe, 2)) / (Math.pow(($scope.requiredReturn / 100), 2))
    $scope.adjustedBondComponent = $scope.bondComponent * $scope.payoutRatio
    $scope.adjustedGrowthComponent = $scope.growthComponent * (1 - $scope.payoutRatio)
    $scope.equityMultiplier = $scope.adjustedBondComponent + $scope.adjustedGrowthComponent
    $scope.equityPerShare = $scope.closingEquity * 1000000 / $scope.outstandingShares
    $scope.intrinsicValue = $scope.equityMultiplier * $scope.equityPerShare
    $scope.currentMarginOfSafety = ($scope.intrinsicValue - $scope.currentSharePrice) / $scope.intrinsicValue
    $scope.purchasedMarginOfSafety = ($scope.intrinsicValue - $scope.purchasedPrice) / $scope.intrinsicValue
  }
  $scope.annualDividends = 2.722
  $scope.annualDividendsConfig = {
    title: 'Annual dividends',
    units: '$M',
    tip: 'Total dividends paid for the FY millions of AUD',
    callback: doCalc
  }
  $scope.frankingPercentage = 100
  $scope.frankingPercentageConfig = {
    title: 'Franking percentage',
    units: '%',
    tip: 'TODO',
    callback: doCalc
  }
  $scope.retainedEarnings = 10.724
  $scope.retainedEarningsConfig = {
    title: 'Retained earnings',
    units: '$M',
    tip: 'TODO',
    callback: doCalc
  }
  $scope.changeInReserves = 3.253
  $scope.changeInReservesConfig = {
    title: 'Change in reserves',
    units: '$M',
    tip: 'TODO',
    callback: doCalc
  }
  $scope.abnormals = 1.3
  $scope.abnormalsConfig = {
    title: 'Abnormals',
    units: '$M',
    tip: 'TODO',
    callback: doCalc
  }
  $scope.openingEquity = 48.911
  $scope.openingEquityConfig = {
    title: 'Opening equity',
    units: '$M',
    tip: 'TODO',
    callback: doCalc
  }
  $scope.newNetOrdinaryEquity = 0.323
  $scope.newNetOrdinaryEquityConfig = {
    title: 'New net ordinary equity',
    units: '$M',
    tip: 'TODO',
    callback: doCalc
  }
  $scope.requiredReturn = 9
  $scope.requiredReturnConfig = {
    title: 'Required return',
    units: '%',
    tip: 'TODO',
    callback: doCalc
  }
  $scope.closingEquity = 63.211
  $scope.closingEquityConfig = {
    title: 'Closing equity',
    units: '$M',
    tip: 'TODO',
    callback: doCalc
  }
  $scope.outstandingShares = 96634354
  $scope.outstandingSharesConfig = {
    title: 'Outstanding shares',
    units: '',
    tip: 'TODO',
    callback: doCalc
  }
  $scope.currentSharePrice = 10.29
  $scope.currentSharePriceConfig = {
    title: 'Current share price',
    units: '$',
    tip: 'TODO',
    callback: doCalc
  }
  $scope.purchasedPrice = 12.44
  $scope.purchasedPriceConfig = {
    title: 'Purchased share price',
    units: '$',
    tip: 'TODO',
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
    link: function (scope, element, attrs) {
      scope.theId = scope.ivcConfig.title.toLowerCase().replace(' ', '-')
    }
  }
})
