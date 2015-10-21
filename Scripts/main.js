//define(['Scripts/d3.v3', 'Scripts/elasticsearch'], function (d3, elasticsearch) {
define(['d3', 'd3Tip', 'nvd3'], function (d3, d3Tip,nv) {
    "use strict";

    // var client = new elasticsearch.Client({
    //     host: 'http://localhost:9200/',
       
       
    // });

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

    // Viz for sparklines/pie-charts
    client.search({
    	index: 'webpage',
        body :{
        		query: {
  filtered: {
  query: {
    match_all: {}
   },
      filter: {
        
       exists: {
         field: "availableAtOrFrom.address"
       }
      }
    }
  }, 
  aggs: {
            
            in_address: {
               terms: {
                 field : "availableAtOrFrom.address.addressRegion"
               },
    
            
            aggs:{
              publishers:{
                terms:{
                   field : "mainEntityOfPage.publisher.name"
                }
              }
            }
            }
      
         }
     }
 
    }).then(function (resp) {
        console.log(resp);
        // D3 code goes here.
    });






    // Viz for bar chart
    client.msearch({
        index: 'offer',
        body:[

            { _index: 'offer' },
            {
                aggs : {
                    articles_over_time : {
                        date_histogram : {
                            field : "validFrom",
                            interval : "month"
                        }
                    }
                },
                size:"0"
            },
            { _index: 'offer' },
            {
               fields: [
                   "validFrom"
                ],
               filter: {
                  and: [
                     {
                        exists: {
                           field: "validFrom"
                        }
                     },
                     {
                            match_all: {
                                "availableAtOrFrom.name" : "Buffalo"
                            }
                        }
                  ]
               }
            }
            
        ]
    }).then(function (resp) {
        console.log(resp);
        // Overall aggregation
        var ageCounts = resp.responses[0].aggregations.articles_over_time.buckets;
        var freqs = [];
        var ages = [];
        var counts = [];
        var specificAges = [];
        var specificCounts = [];

        // Specific ages
        var specificAges = resp.responses[1].hits.hits
        specificAges.forEach( function(obj){
            var ageFields = obj.fields
            for(var field in ageFields){
                var ages = ageFields[field];
                for (var id in ages){
                    var specificDateString = ages[id];
                    var d = new Date(specificDateString);
                    var month = d.getMonth()+1;
                    if(d.getMonth()<10)
                        month = "" + 0 + month;
                    specificAges.push(""+d.getFullYear()+"-"+month);
                }
            }
        });


        function countInArray(array, what) {
            var count = 0;
            for (var i = 0; i < array.length; i++) {
                if (array[i] === what) {
                    count++;
                }
            }
            return count;
        }


        ageCounts.forEach( function(obj){
            var age = obj["key_as_string"];
            var d = new Date(age);
            var month = d.getMonth()+1;
            if(d.getMonth()<10)
                month = "" + 0 + month;
            var dateString = "" + d.getFullYear() + "-" + month

            if (specificAges.indexOf(dateString) > -1) {
                var ageCount = countInArray(specificAges,dateString);
                specificCounts.push(ageCount);
                freqs.push({"age":dateString,"count":0+obj["doc_count"],"specificCount":ageCount*-1})    
            }else {
                freqs.push({"age":dateString,"count":0+obj["doc_count"],"specificCount":0})
            }
            

            ages.push(dateString)
            counts.push(0+obj["doc_count"])
        });
                
        try{
            nv.addGraph(function() {
              var chart = nv.models.discreteBarChart()
                  .width("400")
                  .height("200")
                  // .forceY("[-80,80]")
                  .x(function(d) { return d.x })    //Specify the data accessors.
                  .y(function(d) { return d.y })
                  .staggerLabels(true)   //Too many bars and not enough room? Try staggering labels.
                  .showValues(false)
                  .showXAxis(false)       //...instead, show the bar value right on top of each bar.

              d3.select('#bar-graph svg')
                .datum(getData())
                .call(chart);
              //nv.utils.windowResize(chart.update);
	      
              return chart;
            });
        }catch(e){
            console.log(e)
        }
        function getData() {
            var values1 = [];
            var values2 = [];
            freqs.forEach(function( obj){
                values1.push(
                {
                    "x":obj.age,
                    "y":obj.count
                });
                values2.push(
                {
                    "x":obj.age,
                    "y":obj.specificCount
                });
            })

            return [
            {
                key:"Interval1",
                values: values1,
                "type": "line",
                "yAxis": 1
            },
            {
                key:"Interval2",
                values: values2,
                "type": "bar",
                "yAxis": 2
            }
        ]
    };
  });
});
