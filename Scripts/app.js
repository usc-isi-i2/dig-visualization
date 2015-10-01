
var app = angular.module("D3Graphics", []);


app.controller('MainCtrl', function($scope) {
  $scope.piechartcontrol = {
  };
});


app.directive("pieChart", function() {

    return {
       restrict : 'E',
        replace: true,
       
      
        template: function (elem, attr) {

            return '<div id="pieChart"></div>'


        },  
        
        scope: {
            control: '=control'
        },
      
        link: function (scope, element, attrs) {

            scope.internalControl = scope.control || {};
            
            scope.internalControl.loadPies = function(query)
            {

            var client = new elasticsearch.Client({

                host: 'http://localhost:9200/',

            });
            var queryJson = {};
            queryJson.type = 'WebPage';
            queryJson.index = 'dig';
            queryJson.body = JSON.parse(query);
            client.search(queryJson).then(function (resp) {


                var colors = ['red', 'green', 'blue', 'orange', 'yellow', 'royalblue', 'cyan', 'indigo', 'rebeccapurple', 'olive'];
                var colorIndex = 0;
                function getRandomColor() {

                    colorIndex = (colorIndex + 1) % colors.length;
                    return colors[colorIndex];


                }
                var dict = {};
                var aggregationsStates = resp.aggregations.in_address;
                var statesCount = aggregationsStates.buckets.length;

                for (var i = 0; i < statesCount; i++) {

                    var colorsArray = [];
                    var stateBucket = aggregationsStates.buckets[i];
                    var publishersCount = stateBucket.publishers.buckets.length;
                    var buckets = stateBucket.publishers.buckets;
                    var doc_count = stateBucket.doc_count;
                    var myValues = [];
                    var offsetObj = {};
                    var totalDisplayed = 0;
                    for (j = 0; j < publishersCount && j < 5; j++) {

                        myValues.push(buckets[j].doc_count);
                        offsetObj[j] = buckets[j].key;
                        if (dict[buckets[j].key]) {

                            colorsArray[j] = dict[buckets[j].key];

                        }
                        else {

                            dict[buckets[j].key] = getRandomColor();
                            colorsArray[j] = dict[buckets[j].key];

                        }
                        totalDisplayed += buckets[j].doc_count;

                    }

                    var remainingValues = 0;
                    if (j < publishersCount) {

                        remainingValues = doc_count - totalDisplayed;
                        myValues.push(remainingValues);
                        offsetObj[j] = "Others";
                        if (dict["Others"]) {

                            colorsArray[j] = dict["Others"];

                        }
                        else {

                            dict["Others"] = getRandomColor();
                            colorsArray[j] = dict["Others"];

                        }

                    }

                    $("#pieChart").append("<div id=\"pieChart" + i + "\"></div>")
                    $('#pieChart' + i).sparkline(myValues, {

                        type: 'pie',
                        sliceColors: colorsArray,
                        tooltipFormat: '{{offset:offset}} ({{percent.1}}%)',
                        tooltipValueLookups: {

                            'offset': offsetObj

                        },


                    });
                    $("#pieChart" + i).append("<div>" + stateBucket.key + "</div>");



                }


                // D3 code goes here.
            });
            }

            scope.attr = attrs.attr1;

            //            alert("I am loaded1");
            // scope.title = scope.$eval(attrs.attr1);
            //alert(scope.title);
        }

    };

});

