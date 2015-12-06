//Angular Module
var phoneNumber = function(pNumber)
{
    var self = this;
    self.number = pNumber;
    return self;
}
var dict = {};
var colors = d3.scale.category10().range();
var colorIndex = 0;

function getRandomColor() {
  colorIndex = (colorIndex + 1) % colors.length;
  return colors[colorIndex];
}

var app = angular.module("D3Graphics", []);


app.controller('MainCtrl', function($scope) {
  $scope.piechartcontrol = {
  };
  $scope.linechartcontrol = {
  };
  
  $scope.callSubmit = function()
  {
      
             var client = new elasticsearch.Client({
        host : [
            {
              host: '54.69.161.139',
              headers:{'Authorization' : 'Basic ZGFycGFtZW1leDpkYXJwYW1lbWV4'},
              protocol: 'http',
              port: '8081',
              path: 'dig-ht-latest/seller',
              log: 'trace',
             
            }
          ]
        });
            var queryJson = {};
            var query = nameQuery;
            query.query.match.description = $scope.query;
            $scope.phoneNumbers = [];
            //queryJson.body = JSON.parse(query);
            queryJson.body = query;
            client.search(queryJson).then(function (resp) {
                    
                  
                    var length = resp.aggregations.second_level.buckets.length;
                    var buckets = resp.aggregations.second_level.buckets;
                    for(bucketItr = 0; bucketItr < length; bucketItr++)
                    {
                        var newPhoneNumber = new phoneNumber(buckets[bucketItr].key);
                        $scope.phoneNumbers.push(newPhoneNumber);
                        
                    }
                    $scope.$apply($scope.phoneNumbers);
                    
            });
            
      $scope.clearVis();
     // alert($scope.radioValue);
    
  }
  
  $scope.clearVis = function()
  {
      $("#pieChart").html("");
      $("#barChart").html("");
      $("#lineChart").html("");
      
  }
  
});

app.directive("lineChart", function() {

    return {
        restrict : 'E',
        replace: true,
        template: function (elem, attr) {
            return '<span></span>'
        },  
        
        scope: {
            control: '=control'
        },
      
        link: function (scope, element, attrs) {
           scope.valueQuery = attrs.valuequery;
           scope.idval = attrs.idval; 
            
           

                      var client = new elasticsearch.Client({
        host : [
            {
              host: '54.69.161.139',
              headers:{'Authorization' : 'Basic ZGFycGFtZW1leDpkYXJwYW1lbWV4'},
              protocol: 'http',
              port: '8081',
              path: 'dig-ht-latest',
              log: 'trace',
             
            }
          ]
        });
         
              var queryJson = {};
            var query = numDateQuery;
          
             query.query.match["mainEntity.seller.telephone.name"] = ""+ attrs.number + ""; 
            //$scope.phoneNumbers = [];
            //queryJson.body = JSON.parse(query);
            queryJson.body = query;
           
            var year2011 = {};
            var year2012 = {};
            var year2013 = {};
            var year2014 = {};
            var year2015 = {};
           
            var months = {};
            months["01"] = "January";
            months["02"] = "February";
            months["03"] = "March";
            months["04"] = "April";
            months["05"] = "May";
            months["06"] = "June";
            months["07"] = "July";
            months["08"] = "August";
            months["09"] = "September";
            months["10"] = "October";
            months["11"] = "Novemeber";
            months["12"] = "December";
            
            client.search(queryJson).then(function (resp) {
                var aggregationsSecondlevel = resp.aggregations.second_level;
               
                    
            
                    var secondLevelCount = aggregationsSecondlevel.buckets.length;
                    var buckets = aggregationsSecondlevel.buckets;
                    var offCount = 0;
                    var myValues = [];
                    var offsetObj = {};
                    
                    for (var j = 0; j < secondLevelCount ; j++) {
                        var year = buckets[j].key_as_string.split('-')[0];
                        var month = buckets[j].key_as_string.split('-')[1];
                     
                        if(year == "2011")
                            year2011[month] = buckets[j].doc_count;
                        if(year == "2012")
                            year2012[month] = buckets[j].doc_count;
                        if(year == "2013")
                            year2013[month] = buckets[j].doc_count;
                        if(year == "2014")
                            year2014[month] = buckets[j].doc_count;
                        if(year == "2015")
                            year2015[month] = buckets[j].doc_count;
                    }
                  
                    for(var i =1; i <= 12; i++) 
                    {
                        var str = "";
                        if(i < 10)
                            str = "0" + i;
                        else
                            str = "" + i;
                       var value = 0;
                       if(year2011[str]){ 
                        value = year2011[str];
                        myValues.push(value);
                       }
                       else
                        myValues.push(0);
                        
                         offsetObj[offCount++] = months[str] + '- 2011'+  ' : '+ value;
                    }
                      for(var i =1; i <= 12; i++) 
                    {
                        var str = "";
                        if(i < 10)
                            str = "0" + i;
                        else
                            str = "" + i;
                       var value = 0;
                       if(year2012[str]){ 
                        value = year2012[str];
                        myValues.push(value);
                       }
                       else
                        myValues.push(0);
                        
                         offsetObj[offCount++] = months[str] + '- 2012'+  ' : '+ value;
                    }
                      for(var i =1; i <= 12; i++) 
                    {
                        var str = "";
                        if(i < 10)
                            str = "0" + i;
                        else
                            str = "" + i;
                       var value = 0;
                       if(year2013[str]){ 
                        value = year2013[str];
                        myValues.push(value);
                       }
                       else
                        myValues.push(0);
                        
                         offsetObj[offCount++] = months[str] + '- 2013'+ ' : '+ value;
                    }
                      for(var i =1; i <= 12; i++) 
                    {
                        var str = "";
                        if(i < 10)
                            str = "0" + i;
                        else
                            str = "" + i;
                       var value = 0;
                       if(year2014[str]){ 
                        value = year2014[str];
                        myValues.push(value);
                       }
                       else
                        myValues.push(0);
                        
                         offsetObj[offCount++] = months[str] + '- 2014'+  ' : '+ value;
                    }
                      for(var i =1; i <= 12; i++) 
                    {
                        var str = "";
                        if(i < 10)
                            str = "0" + i;
                        else
                            str = "" + i;
                        var value = 0;
                       if(year2015[str]){ 
                        value = year2015[str];
                        myValues.push(value);
                       }
                       else
                        myValues.push(0);
                        
                         offsetObj[offCount++] = months[str] + '- 2015'+ ' : '+ value;
                    }
                       
                    $('#lineChart-' + scope.idval).sparkline(myValues, {

                        type: 'line',
                        //sliceColors: colorsArray,
                        tooltipFormat: '{{offset:offset}} ',
                        tooltipValueLookups: {

                            'offset': offsetObj

                        },
                    });
            });
        }
    };
});





app.directive("pieChart", function() {

    return {
       restrict : 'E',
        replace: true,
       
      
        template: function (elem, attr) {

            return '<span></span>'


        },  
        
        scope: {
            control: '=control'
        },
      
        link: function (scope, element, attrs) {
            
            scope.valueQuery = attrs.valuequery;
            scope.idVal = attrs.idval;
            scope.dispVal = attrs.dispval;
            //alert(scope.valueQuery);
                     var client = new elasticsearch.Client({
        host : [
            {
              host: '54.69.161.139',
              headers:{'Authorization' : 'Basic ZGFycGFtZW1leDpkYXJwYW1lbWV4'},
              protocol: 'http',
              port: '8081',
              path: 'dig-ht-latest',
              log: 'trace',
             
            }
          ]
        });
         
            
            
         
            var queryJson = {};
            var query = aggOnPhoneQuery;
            query.aggs.first_level.terms.field = scope.valueQuery;
             query.query.match["mainEntity.seller.telephone.name"] = ""+ attrs.number + ""; 
            //$scope.phoneNumbers = [];
            //queryJson.body = JSON.parse(query);
            queryJson.body = query;
           
           
            client.search(queryJson).then(function (resp) {


             
           
                var aggregationsFirstlevel = resp.aggregations.first_level;
                var firstLevelCount = aggregationsFirstlevel.buckets.length;
                 var colorsArray = [];
                
                  
                    var myValues = [];
                    var offsetObj = {};
                    var totalDisplayed = 0;
                for (var i = 0; i < firstLevelCount; i++) {

                     var firstLevelBucket = aggregationsFirstlevel.buckets[i];
                 
                        myValues.push(firstLevelBucket.doc_count);
                        offsetObj[i] = firstLevelBucket.key;
                        if (dict[firstLevelBucket.key]) {

                            colorsArray[i] = dict[firstLevelBucket.key];

                        }
                        else {

                            dict[firstLevelBucket.key] = getRandomColor();
                            colorsArray[i] = dict[firstLevelBucket.key];

                        }
                        totalDisplayed += firstLevelBucket.doc_count;

                    }

//                     var remainingValues = 0;
//                     if (j < secondLevelCount) {
// 
//                         remainingValues = doc_count - totalDisplayed;
//                         myValues.push(remainingValues);
//                         offsetObj[j] = "Others";
//                         if (dict["Others"]) {
// 
//                             colorsArray[j] = dict["Others"];
// 
//                         }
//                         else {
// 
//                             dict["Others"] = getRandomColor();
//                             colorsArray[j] = dict["Others"];
// 
//                         }

                    

                
                    $('#pieChart-' + scope.idVal).sparkline(myValues, {

                        type: 'pie',
                        sliceColors: colorsArray,
                        tooltipFormat: scope.dispVal  + '{{offset:offset}} ({{percent.1}}%)',
                        tooltipValueLookups: {

                            'offset': offsetObj

                        },
                    });
                    
            });
        
        }
           

    };

});


app.directive("barChart", function() {

    return {
       restrict : 'E',
        replace: true,
       
      
        template: function (elem, attr) {

            return '<span></span>'


        },  
        
        scope: {
            control: '=control'
        },
      
        link: function (scope, element, attrs) {
            
            scope.valueQuery = attrs.valuequery;
            scope.idVal = attrs.idval;
            scope.dispVal = attrs.dispval;
            var client = new elasticsearch.Client({
              host : [{
                host: '54.69.161.139',
                headers:{'Authorization' : 'Basic ZGFycGFtZW1leDpkYXJwYW1lbWV4'},
                protocol: 'http',
                port: '8081',
                path: 'dig-ht-latest',
                log: 'trace'
              }]
            });
         
            var queryJson = {};
            var query = aggOnPhoneQuery;
            query.aggs.first_level.terms.field = scope.valueQuery;
            query.query.match["mainEntity.seller.telephone.name"] = ""+ attrs.number + ""; 
            
            queryJson.body = query;
           
           
            client.search(queryJson).then(function (resp) {
              var aggregationsFirstlevel = resp.aggregations.first_level;
              var firstLevelCount = aggregationsFirstlevel.buckets.length;
              var colorsArray = [];
                
                  
              var myValues = [];
              var offsetObj = {};
              var totalDisplayed = 0;

              for (var i = 0; i < firstLevelCount; i++) {
                var firstLevelBucket = aggregationsFirstlevel.buckets[i];
                myValues.push(firstLevelBucket.doc_count);
                offsetObj[i] = firstLevelBucket.key;
                if (dict[firstLevelBucket.key]) {
                  colorsArray[i] = dict[firstLevelBucket.key];
                } else {
                  dict[firstLevelBucket.key] = getRandomColor();
                  colorsArray[i] = dict[firstLevelBucket.key];
                }
                totalDisplayed += firstLevelBucket.doc_count;
              }
              // Adding 0 to everything so that 0 will be the smallest value, and the rest of the values are to scale.
              myValues.push(0);
              // Need to use chartRangeMin and chartRangeMax to specify the same scale for all bar graphs.
              $('#barChart-' + scope.idVal).sparkline(myValues, {
                  type: 'bar', 
                  colorMap: colorsArray,
                  tooltipFormatter : function(sparkline, options, fields){
                    if( fields[0].value == 0){
                      return ""
                    } else {
                      return "Age:" + offsetObj[fields[0].offset] + " - " + fields[0].value;
                    }
                  }

              });
              // End sparkline
                
            });
          // End client.search.then
        }
        // End link   
    };
    // End return
});
// End directive
