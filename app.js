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
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: 'Total dividends paid for the FY in millions of AUD',
    callback: doCalc
  }
  $scope.frankingPercentage = 100
  $scope.frankingPercentageConfig = {
    title: 'Franking percentage',
    unitsSuffix: '%',
    tip: 'The percentage of the dividend that is franked',
    callback: doCalc
  }
  $scope.retainedEarnings = 10.724
  $scope.retainedEarningsConfig = {
    title: 'Retained earnings/profits',
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: 'How much did the business keep at the EOFY',
    callback: doCalc
  }
  $scope.changeInReserves = 3.253
  $scope.changeInReservesConfig = {
    title: 'Change in reserves',
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: "How much did the business' stock pile of cash change over the FY",
    callback: doCalc
  }
  $scope.abnormals = 1.3
  $scope.abnormalsConfig = {
    title: 'Abnormals',
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: "One off costs that business incurred this year but doesn't expect to be recurring",
    callback: doCalc
  }
  $scope.openingEquity = 48.911
  $scope.openingEquityConfig = {
    title: 'Opening equity',
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: 'How much equity was on the market at the start of the FY',
    callback: doCalc
  }
  $scope.newNetOrdinaryEquity = 0.323
  $scope.newNetOrdinaryEquityConfig = {
    title: 'New net ordinary equity',
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: 'How much new equity (in millions of AUD) was issued during the FY',
    callback: doCalc
  }
  $scope.requiredReturn = 9
  $scope.requiredReturnConfig = {
    title: 'Required return',
    unitsSuffix: '%',
    tip: 'What return do you require from your investment. You make this number up yourself',
    callback: doCalc
  }
  $scope.closingEquity = 63.211
  $scope.closingEquityConfig = {
    title: 'Closing equity',
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: 'How much equity was on the market at the EOFY',
    callback: doCalc
  }
  $scope.outstandingShares = 96634354
  $scope.outstandingSharesConfig = {
    title: 'Outstanding shares',
    unitsSuffix: 'shares',
    tip: 'How many shares were on the market at the EOFY (also called "issued capital")',
    callback: doCalc
  }
  $scope.currentSharePrice = 10.29
  $scope.currentSharePriceConfig = {
    title: 'Current share price',
    unitsPrefix: '$',
    tip: 'How much is the share price right now',
    callback: doCalc
  }
  $scope.purchasedPrice = 12.44
  $scope.purchasedPriceConfig = {
    title: 'Purchased share price',
    unitsPrefix: '$',
    tip: "If you've purchased this stock, what is your (average) purchase price",
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
