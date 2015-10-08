﻿//Angular Module
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

            return '<div id="map"></div>'


        },  
        
        scope: {
            control: '=control'
        },
      
        link: function (scope, element, attrs) {

            scope.internalControl = scope.control || {};
            
            scope.internalControl.loadPies = function(query)
            {

            var client = new elasticsearch.Client({

                host: 'http://54.69.161.139:8081/',

            });
            var queryJson = {};
            queryJson.type = 'offer';
            queryJson.index = 'dig-ht-latest';
            queryJson.body = JSON.parse(query);
            client.search(queryJson).then(function (resp) {
		var dict = {};
                var aggregationsFirstlevel = resp.aggregations.in_offers;
                var firstLevelCount = aggregationsFirstlevel.buckets.length;
		
		 features = '{'+
       '"type"'+':'+'"FeatureCollection"'+','+
       '"features"'+': [';
		
		for (var i = 0; i < 4; i++) {
			
		    var firstLevelBucket = aggregationsFirstlevel.buckets[i];
                     var doc_count = firstLevelBucket.doc_count;
		     var radius = doc_count;

		     var hits = firstLevelBucket.top_tag_hits.hits.hits[0];
		     var source = hits["_source"];
		     var longitude = source.availableAtOrFrom.geo.longitude;
		     var latitude = source.availableAtOrFrom.geo.latitude;
		     var region = source.availableAtOrFrom.address.addressRegion
                     
                
     		     features+='{';
			
			 if(i == 3) {
			features+= '"geometry"'+' : {'+
        		'"type"'+':'+'"Point"'+','+
        		'"coordinates"'+':'+ '['+longitude+','+ latitude+']'+'},"type": "Feature",'+
     			'"properties"'+' : {'+'"radius"'+':'+radius+','+'"countryName"'+':'+'"'+region+'"'+'}}';
      
      		      }
      		      else{
      		    
			features+= '"geometry"'+' : {'+
        		'"type"'+':'+'"Point"'+','+
        		'"coordinates"'+':'+ '['+longitude+','+ latitude+']'+'},"type": "Feature",'+
     			'"properties"'+' : {'+'"radius"'+':'+radius+','+'"countryName"'+':'+'"'+region+'"'+'}},';
			 
		
			}
			
		}
		features+= ']}';
		alert(features);
	
                
            });
            }

            scope.attr = attrs.attr1;

            //            alert("I am loaded1");
            // scope.title = scope.$eval(attrs.attr1);
            //alert(scope.title);
        }

    };

});
