"use strict";
    drawClusterMap();
	var features = "";
    function addPhoneNumbers() {
      var checkboxes = document.getElementsByName("phone-checkbox");
      var checkboxesChecked = [];
      // loop over them all
      for (var i=0; i<checkboxes.length; i++) {
        var id = checkboxes[i].id.split("-")[1];
        id = "#glyph-button-" + id;
         // And stick the checked ones onto an array...
         if (checkboxes[i].checked) {
            var phoneNumber = checkboxes[i].id.split("-")[1];
            checkboxesChecked.push(phoneNumber);
            $( id ).addClass( "active" );
         }else{
          if ($( id ).hasClass( "active" )){
            $( id ).removeClass( "active" );
          }
         }
      }
      if ( checkboxesChecked.length > 0 ){
        var phoneStrings = checkboxesChecked.join(",");
        drawSpecificMap(phoneStrings);
      } else {
        drawClusterMap();
      }
    }

  function drawClusterMap(){
    var client = new elasticsearch.Client({
        host : [
            {
              host: '54.69.161.139',
              headers:{'Authorization' : 'Basic ZGFycGFtZW1leDpkYXJwYW1lbWV4'},
              protocol: 'http',
              port: '8081',
              path: 'dig-ht-latest',
              log: 'trace'
            }
          ]
    });

    client.search({
      type: 'seller',
      body :{
        query: {
          filtered: {
             filter: {
                exists: {
                   field: "makesOffer.availableAtOrFrom.geo"
                }
             }
          }
       },
      aggs: {
        in_phone: {
          terms: {
            field: "telephone.name",
            size: 20
          },
          aggs: {
            in_address: {
                terms: {
                  field: "makesOffer.availableAtOrFrom.address.addressLocality",
                  size: 20
                },
                aggs: {
                  top_tag_hits: {
                      top_hits: {
                        size: 1,
                        _source: {
                            include: [
                              "makesOffer.availableAtOrFrom.geo",
                              "makesOffer.availableAtOrFrom.address.addressLocality"
                            ]
                        }
                      }
                  }
                }
            }
          }
      }
    },
    size: 0
    }
     
    }).then(function (resp) {
        //console.log(resp);
            // D3 code goes here.
        var firstLevelbucketItems = resp.aggregations.in_phone.buckets;
        var firstLevelbucketCount = resp.aggregations.in_phone.buckets.length;
        
        var addressPoints = [];
        var numbeList = [];
            var l = 0;    
        for(var i=0;i<firstLevelbucketCount;i++)
        {
          var secondLevelbucketItems = firstLevelbucketItems[i].in_address.buckets;
          var secondLevelbucketCount = firstLevelbucketItems[i].in_address.buckets.length;
          var number = firstLevelbucketItems[i].key;
          for(var k=0;k<secondLevelbucketCount;k++)
          {
            var address = "";
            var latitude = 0, longitude = 0;
            var makesOffer = secondLevelbucketItems[k].top_tag_hits.hits.hits[0]._source.makesOffer[0];
            if(makesOffer)
            {
              var points = [];
              points[0] = makesOffer.availableAtOrFrom.geo.lat;
              points[1] = makesOffer.availableAtOrFrom.geo.lon;
              addressPoints[l] = points;
              numbeList[l] = number;
              l+=1;
            }
        
          }
          
        }
      
        display(addressPoints,numbeList);
        
    });  
  }
  function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
   
}
  function drawSpecificMap( phoneNumbers ){
    
	 var phones = phoneNumbers.split(",");
	 for(var i=0;i<phones.length;i++)
	 {
		constructFeatures(phones[i]);
		
	 }
	
	
        //console.log(jsonData);
        displayCustom(features);
            
	
      
    }
	
	function constructFeatures(number1)
	{
		
		var client = new elasticsearch.Client({
          host : [
            {
              host: '54.69.161.139',
              headers:{'Authorization' : 'Basic ZGFycGFtZW1leDpkYXJwYW1lbWV4'},
              protocol: 'http',
              port: '8081',
              path: 'dig-ht-latest',
              log: 'trace'
            }
          ]
        });
      var colors = ["rgb(229,131,0)","rgb(0,210,15)","rgb(0,80,191)","rgb(221,0,6)","rgb(213,0,133)",
                    "rgb(91,101,114)","rgb(60,39,11)","rgb(114,67,117)","rgb(248,249,31)","rgb(130,130,130)"];
      
      var color = getRandomInRange(0,5,1);
      var circleColor = colors[Math.round(color)];
        
      client.search({
            type: 'seller',
            body :{
                query: {
                  filtered: {
                    query: {
                      filtered: {
                        filter: {
                          term: { "telephone.name": number1 }
                        }
                      }
                    },
                  filter: {
                    exists: {
                      field: "makesOffer.availableAtOrFrom.geo"
                    }
                  }
                }
              },
            aggs: {
              in_address: {
                terms: {
                    field: "makesOffer.availableAtOrFrom.address.addressLocality",
                    size: 100
                  },
                  aggs: {
                    top_tag_hits: {
                      top_hits: {
                        size: 1,
                        _source: {
                            include: [
                              "makesOffer.availableAtOrFrom.geo",
                              "makesOffer.availableAtOrFrom.address.addressLocality"
                              ]
                        }
                      }
                    }
                  }
                }
             },
          size:0
          }
    }).then(function (resp) {
      
      var firstLevelbucketItems = resp.aggregations.in_address.buckets;
      var firstLevelbucketCount = resp.aggregations.in_address.buckets.length;
    
      var j = 0;
      for(var i=0;i<firstLevelbucketCount;i++)
      {
           var city = firstLevelbucketItems[i].key;
           var radius = firstLevelbucketItems[i].doc_count
           var plottingRadius =  10+ Math.log(radius);
            
            
            var makesOffer = firstLevelbucketItems[i].top_tag_hits.hits.hits[0]._source.makesOffer[0];
            if(makesOffer)
            {
              var address = makesOffer.availableAtOrFrom.address[0].addressLocality;
              var longitude = makesOffer.availableAtOrFrom.geo.lat;
              var latitude = makesOffer.availableAtOrFrom.geo.lon;
              
              features+= '{"geometry"'+' : {'+
              '"type"'+':'+'"Point"'+','+
              '"coordinates"'+':'+ '['+latitude+','+ longitude+']'+
              '},"type": "Feature",'+
              '"properties"'+' : {'+'"radius"'+':'+radius+','+'"plottingRadius"'+':'+plottingRadius+','+'"color"'+':'+'"'+circleColor+'"'+
              ','+'"place"'+':'+'"'+address+'"'+','+'"phoneNumber"'+':'+'"'+number1+'"'+'}},';
          
              
            }
            
      } 
	    
      });
	 
	}

     function displayCustom(data){
		 
		 data = data.substring(0, data.length - 1);
          var jsonData = "";
		   jsonData = '{'+
           '"type"'+':'+'"FeatureCollection"'+','+
           '"features"'+': ['+data+']}';
		   console.log(jsonData);
		  features = "";
          var geojson = JSON.parse(jsonData);
          //needed to reload the map.
          document.getElementById('phone-map').innerHTML = "<div id='map' style='width: <?php echo $this->width; ?>; height: <?php echo $this->height; ?>;'></div>";
          var map = new L.Map('map', {center: new L.LatLng(43.6481, -79.4042), zoom: 4});
          var gmap_layer = new L.Google('ROADMAP');
          map.addLayer(gmap_layer);

          function style(feature,colorValue) {
            return {
                  fillColor:colorValue,
                  color: "#fff",
                  weight: 2,
                  opacity: 1,
                  fillOpacity: 1
            };
          }
          
             
              // load the geojson to the map with marker styling
            L.geoJson(geojson,{
                pointToLayer: function (feature, latlng) {
                 // console.log(latlng);
                  var popupOptions = {maxWidth: 200};
                  var circleColor = feature.properties.color;
				  var city = feature.properties.place;
                  var radius = feature.properties.radius;
                  var plottingRadius = feature.properties.plottingRadius;
                  var popupContent = feature.properties.phoneNumber+" appears "+radius+" times in "+city;
                  var marker = L.circleMarker(latlng,style(feature,circleColor));
                  marker.setRadius(plottingRadius).bindPopup(popupContent,popupOptions);
          
                  return marker
              }
            }).addTo(map);
        }
    
  function display(points,phoneList){
          
    //console.log(points);
    //needed to reload the map.
    document.getElementById('phone-map').innerHTML = "<div id='map' style='width: <?php echo $this->width; ?>; height: <?php echo $this->height; ?>;'></div>";
          
    var map = new L.Map('map', {center: new L.LatLng(34.052234, -118.243685), zoom: 4});
    var gmap_layer = new L.Google('ROADMAP');
    map.addLayer(gmap_layer);
    var markers = L.markerClusterGroup();
        
    for (var i = 0; i < points.length; i++) {
      var a = points[i];
      var title = a[2];
      var marker = L.marker(new L.LatLng(a[0], a[1]), { title: title });
      marker.bindPopup(phoneList[i]);
      markers.addLayer(marker);
    }

    map.addLayer(markers);
	
  }
