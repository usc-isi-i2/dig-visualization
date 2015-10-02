//Angular Module
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
                var aggregationsFirstlevel = resp.aggregations.first_level;
                var firstLevelCount = aggregationsFirstlevel.buckets.length;

                for (var i = 0; i < firstLevelCount; i++) {

                    var colorsArray = [];
                    var firstLevelBucket = aggregationsFirstlevel.buckets[i];
                    var secondLevelCount = firstLevelBucket.second_level.buckets.length;
                    var buckets = firstLevelBucket.second_level.buckets;
                    var doc_count = firstLevelBucket.doc_count;
                    var myValues = [];
                    var offsetObj = {};
                    var totalDisplayed = 0;
                    for (var j = 0; j < secondLevelCount && j < 5; j++) {

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
                    if (j < secondLevelCount) {

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
                    $("#pieChart" + i).append("<div>" + firstLevelBucket.key + "</div>");



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

