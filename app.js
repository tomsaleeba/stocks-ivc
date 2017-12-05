var app = angular.module('ivc', ['angularDc'])

app.controller('TheController', function ($scope) {
  $scope.isInputValid = function () {
    function isNum (value) {
      return typeof value === 'number'
    }
    function isNumGteZero (value) {
      return isNum(value) && value >= 0
    }
    function isNumGtZero (value) {
      return isNum(value) && value > 0
    }
    return isNumGteZero($scope.annualDividends) &&
      isNumGteZero($scope.frankingPercentage) &&
      isNum($scope.retainedEarnings) &&
      isNum($scope.changeInReserves) &&
      isNum($scope.abnormals) &&
      isNumGtZero($scope.openingEquity) &&
      isNumGteZero($scope.newNetOrdinaryEquity) &&
      isNumGteZero($scope.requiredReturn) &&
      isNumGtZero($scope.closingEquity) &&
      isNumGtZero($scope.outstandingShares) &&
      isNumGtZero($scope.currentSharePrice) &&
      isNumGtZero($scope.purchasedPrice)
  }
  $scope.getIntrinsicValue = function () {
    return getValueForHoveredRR('intrinsicValue')
  }
  $scope.getCurrentMarginOfSafety = function () {
    return getValueForHoveredRR('currentMarginOfSafety')
  }
  $scope.getPurchasedMarginOfSafety = function () {
    return getValueForHoveredRR('purchasedMarginOfSafety')
  }
  $scope.isCurrentMarginOfSafetyPositive = function () {
    return $scope.getCurrentMarginOfSafety() > 0
  }
  $scope.isPurchasedMarginOfSafetyPositive = function () {
    return $scope.getPurchasedMarginOfSafety() > 0
  }
  $scope.getRequiredReturn = function () {
    return getValueForHoveredRR('requiredReturn')
  }
  function getValueForHoveredRR (fieldName) {
    if (!$scope.resultRecords) {
      return 0
    }
    return $scope.indexedRecords[$scope.hoveredRequiredReturn][fieldName]
  }
  function doCalc () {
    if (!$scope.isInputValid) {
      // TODO do we need to reset everything?
      return
    }
    var records = []
    $scope.resultRecords = records
    var indexedRecords = {}
    $scope.indexedRecords = indexedRecords
    var maxRequiredReturnFigure = 20
    for (var i = 3; i <= maxRequiredReturnFigure; i++) {
      calcForRR(i)
    }
    function calcForRR (requiredReturn) {
      grossedUpDivs = $scope.annualDividends / (1 - ($scope.frankingPercentage / 100) * 0.3)
      normalisedEarnings = grossedUpDivs + $scope.retainedEarnings + $scope.changeInReserves - $scope.abnormals
      nroe = normalisedEarnings / ($scope.openingEquity + ($scope.newNetOrdinaryEquity/2))
      payoutRatio = grossedUpDivs / normalisedEarnings
      bondComponent = nroe / (requiredReturn / 100)
      growthComponent = (Math.pow(nroe, 2)) / (Math.pow((requiredReturn / 100), 2))
      adjustedBondComponent = bondComponent * payoutRatio
      adjustedGrowthComponent = growthComponent * (1 - payoutRatio)
      equityMultiplier = adjustedBondComponent + adjustedGrowthComponent
      equityPerShare = $scope.closingEquity * 1000000 / $scope.outstandingShares
      intrinsicValue = equityMultiplier * equityPerShare
      currentMarginOfSafety = (intrinsicValue - $scope.currentSharePrice) / intrinsicValue
      purchasedMarginOfSafety = (intrinsicValue - $scope.purchasedPrice) / intrinsicValue
      var o = {
        requiredReturn: requiredReturn,
        grossedUpDivs: grossedUpDivs,
        normalisedEarnings: normalisedEarnings,
        nroe: nroe,
        payoutRatio: payoutRatio,
        payoutRatioPercentage: payoutRatio * 100,
        bondComponent: bondComponent,
        growthComponent: growthComponent,
        adjustedBondComponent: adjustedBondComponent,
        adjustedGrowthComponent: adjustedGrowthComponent,
        equityMultiplier: equityMultiplier,
        equityPerShare: equityPerShare,
        intrinsicValue: intrinsicValue,
        currentMarginOfSafety: currentMarginOfSafety,
        purchasedMarginOfSafety: purchasedMarginOfSafety,
      }
      records.push(o)
      indexedRecords[o.requiredReturn] = o
    }
    var ndx = crossfilter(records)
    $scope.theDimension = ndx.dimension(function (d) {
      return d.requiredReturn
    })
    $scope.theGroup = $scope.theDimension.group().reduceSum(function (d) {
      return d.intrinsicValue
    })
    $scope.hoveredRequiredReturn = 9 // FIXME set default RR
    $scope.chartPostSetup = function (theChart, _) {
      var dotRadius = 5
      theChart.title(function (d) {
        var roundedValue = Math.round(d.value * 100) / 100
        var strRoundedValue = '' + roundedValue
        if (/\.\d$/.test(strRoundedValue)) {
          strRoundedValue += '0'
        }
        return d.key + '% = $' + strRoundedValue
      })
      .yAxisPadding('10%')
      .renderDataPoints({
        fillOpacity: 0.8,
        strokeOpacity: 0.8,
        radius: dotRadius
      })
      .dotRadius(dotRadius * 1.4)
      .width(document.getElementById('chart-container').clientWidth)
      .on('renderlet', function (chart) {
        chart.selectAll('circle').on('mouseover', function (d) {
          $scope.hoveredRequiredReturn = d.x
          $scope.$apply()
        })
        var lastXValue = chart.x().range()[chart.x().range().length-1]
        var secondLastXValue = chart.x().range()[chart.x().range().length-2]
        var rightX = lastXValue + (lastXValue - secondLastXValue)
        var extra_data = [
          {x: 0,      y: chart.y()($scope.currentSharePrice)},
          {x: rightX, y: chart.y()($scope.currentSharePrice)}
        ]
        var line = d3.svg.line()
          .x(function(d) { return d.x })
          .y(function(d) { return d.y })
          .interpolate('linear')
        var chartBody = chart.select('g.chart-body')
        var path = chartBody.selectAll('path.extra').data([extra_data])
        path.enter().append('path').attr({
          stroke: 'red',
          'stroke-width': '2px',
          id: 'extra-line'
        })
        path.attr('d', line)
        var text = chartBody.selectAll('text.extra-label').data([0])
        text.enter()
          .append('text').attr({
            'text-anchor': 'middle',
            transform: 'translate(-0, -7)'
          })
          .append('textPath').attr({
            class: 'extra-label',
            'xlink:href': '#extra-line',
            startOffset: '80%'
          })
          .text('Current market price ($' + $scope.currentSharePrice + ')')
      })
    }
  }
  $scope.annualDividends = 2.722
  $scope.annualDividendsConfig = {
    title: 'Annual dividends',
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: 'Total dividends paid for the FY in millions of AUD',
    callback: doCalc,
    isAllowNegative: false,
    isAllowZero: true
  }
  $scope.frankingPercentage = 100
  $scope.frankingPercentageConfig = {
    title: 'Franking percentage',
    unitsSuffix: '%',
    tip: 'The percentage of the dividend that is franked',
    callback: doCalc,
    isAllowNegative: false,
    isAllowZero: true
  }
  $scope.retainedEarnings = 10.724
  $scope.retainedEarningsConfig = {
    title: 'Retained earnings/profits',
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: 'How much did the business keep at the EOFY',
    callback: doCalc,
    isAllowNegative: true,
    isAllowZero: true
  }
  $scope.changeInReserves = 3.253
  $scope.changeInReservesConfig = {
    title: 'Change in reserves',
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: "How much did the business' stock pile of cash change over the FY",
    callback: doCalc,
    isAllowNegative: true,
    isAllowZero: true
  }
  $scope.abnormals = 1.3
  $scope.abnormalsConfig = {
    title: 'Abnormals',
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: "One off costs that business incurred this year but doesn't expect to be recurring",
    callback: doCalc,
    isAllowNegative: true,
    isAllowZero: true
  }
  $scope.openingEquity = 48.911
  $scope.openingEquityConfig = {
    title: 'Opening equity',
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: 'How much equity was on the market at the start of the FY',
    callback: doCalc,
    isAllowNegative: false,
    isAllowZero: false
  }
  $scope.newNetOrdinaryEquity = 0.323
  $scope.newNetOrdinaryEquityConfig = {
    title: 'New net ordinary equity',
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: 'How much new equity (in millions of AUD) was issued during the FY',
    callback: doCalc,
    isAllowNegative: false,
    isAllowZero: true
  }
  $scope.requiredReturn = 9
  $scope.requiredReturnConfig = {
    title: 'Required return',
    unitsSuffix: '%',
    tip: 'What return do you require from your investment. You make this number up yourself',
    callback: doCalc,
    isAllowNegative: false,
    isAllowZero: false
  }
  $scope.closingEquity = 63.211
  $scope.closingEquityConfig = {
    title: 'Closing equity',
    unitsPrefix: '$',
    unitsSuffix: 'million',
    tip: 'How much equity was on the market at the EOFY',
    callback: doCalc,
    isAllowNegative: false,
    isAllowZero: false
  }
  $scope.outstandingShares = 96634354
  $scope.outstandingSharesConfig = {
    title: 'Outstanding shares',
    unitsSuffix: 'shares',
    tip: 'How many shares were on the market at the EOFY (also called "issued capital")',
    callback: doCalc,
    isAllowNegative: false,
    isAllowZero: false
  }
  $scope.currentSharePrice = 10.29
  $scope.currentSharePriceConfig = {
    title: 'Current share price',
    unitsPrefix: '$',
    tip: 'How much is the share price right now',
    callback: doCalc,
    isAllowNegative: false,
    isAllowZero: false
  }
  $scope.purchasedPrice = 12.44
  $scope.purchasedPriceConfig = {
    title: 'Purchased share price',
    unitsPrefix: '$',
    tip: "If you've purchased this stock, what is your (average) purchase price",
    callback: doCalc,
    isAllowNegative: false,
    isAllowZero: false
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
      scope.isError = function () {
        var value = scope.ivcModel
        var isAllowNegative = scope.ivcConfig.isAllowNegative
        var isAllowZero = scope.ivcConfig.isAllowZero
        var errorMessages = { // neg|zero
          'truetrue': 'Must be a number, can be negative',
          'truefalse': 'Must be a number, can be negative, but cannot be zero',
          'falsetrue': 'Must be a number greater than or equal to zero',
          'falsefalse': 'Must be a number greater than zero'
        }
        scope.errorMessage = errorMessages['' + isAllowNegative + isAllowZero]
        var isNegative = value < 0
        if (!isAllowNegative && isNegative) {
          return true
        }
        var isZero = value === 0
        if (!isAllowZero && isZero) {
          return true
        }
        return false
      }
    }
  }
})
