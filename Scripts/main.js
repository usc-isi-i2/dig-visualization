//define(['Scripts/d3.v3', 'Scripts/elasticsearch'], function (d3, elasticsearch) {
define(['d3', 'd3Tip', 'nvd3'], function (d3, d3Tip,nv) {
    "use strict";

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

    // Draw timeline based on radio button on click
    var rad = document.timelinespan.span;
    var prev = null;
    for(var i = 0; i < rad.length; i++) {
        rad[i].onclick = function() {
            (prev)? console.log(prev.value):null;
            if(this !== prev) {
                prev = this;
            }
            var span = this.value
            d3.selectAll("svg > *").remove();
            drawTimeline(client,d3,d3Tip,nv,span,"");
        };
    }

    

    // Viz for sparklines/pie-charts
  //   client.search({
  // 		index: 'webpage',
  //       body :{
  //       		query: {
  // filtered: {
  // query: {
  //   match_all: {}
  //  },
  //     filter: {
        
  //      exists: {
  //        field: "availableAtOrFrom.address"
  //      }
  //     }
  //   }
  // }, 
  // aggs: {
            
  //           in_address: {
  //              terms: {
  //                field : "availableAtOrFrom.address.addressRegion"
  //              },
    
            
  //           aggs:{
  //             publishers:{
  //               terms:{
  //                  field : "mainEntityOfPage.publisher.name"
  //               }
  //             }
  //           }
  //           }
      
  //        }
  //    }
 
  //   }).then(function (resp) {
  //       console.log(resp);
  //       // D3 code goes here.
  //   });

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

function drawTimeline(client,d3,d3Tip,nv,span,secondQuery){

    // Viz for bar chart
    if (span != "month" && span != "year")
      span = "month"
    client.msearch({
        index: 'offer',
        body:[

            { _index: 'offer' },
            {
                aggs : {
                    articles_over_time : {
                        date_histogram : {
                            field : "validFrom",
                            interval : span
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
        
        var freqs = [];
        var intervals = [];
        var counts = [];
        var specificEventIntervals = [];
        var specificCounts = [];
        // Overall aggregation
        var overallTimeCounts = resp.responses[0].aggregations.articles_over_time.buckets;

        if( resp.responses.length == 2 ){
        // Specific ages
        specificEventIntervals = resp.responses[1].hits.hits
        }
        
        if(specificEventIntervals.length > 0 ){
          specificEventIntervals.forEach( function(obj){
            var fields = obj.fields
            for(var field in fields){
                
                var fieldVal = fields[field];
                for (var id in fieldVal){
                    
                    var specificDateString = fieldVal[id];
                    var d = new Date(specificDateString);
                    var newDateString = ""
                    if ( span == "month" ){
                      var month = d.getUTCMonth()+1;
                      if(month<10)
                          month = "" + 0 + month;
                      //specificEventIntervals.push(""+d.getFullYear()+"-"+month);
                       newDateString = d.getUTCFullYear() + "-" + month 
                    } else {
                      newDateString = "" + d.getUTCFullYear()
                    }
                    
                    specificEventIntervals.push(newDateString)
                }
            }
          });
        }
    
        overallTimeCounts.forEach( function(obj){
            var interval = obj["key_as_string"];
            var d = new Date(interval);
            var dateString = ""
            if ( span == "month" ){
              var month = d.getUTCMonth()+1;
              if(month<10)
                  month = "" + 0 + month;
              dateString = "" + d.getUTCFullYear() + "-" + month
            }else {
              dateString = "" + d.getUTCFullYear()
            }

            if (specificEventIntervals.indexOf(dateString) > -1) {
                var eventCount = countInArray(specificEventIntervals,dateString);
                specificCounts.push(eventCount);
                freqs.push({"interval":dateString,"count":0+obj["doc_count"],"specificCount":eventCount})    
            }else {
                freqs.push({"interval":dateString,"count":0+obj["doc_count"],"specificCount":0})
            }
            

            intervals.push(dateString)
            counts.push(0+obj["doc_count"])
        });
         
        var data = getData();

        try{

            nv.addGraph(function() {
              var chart = nv.models.linePlusBarChart()
                  //.width("800")
                  .height("200")
                  .x(function(d,i) { return i })   
                  .y(function(d,i) { return d[1] })
                  .color(d3.scale.category10().range())
                  //.options({focusEnable: false});;
                  

              chart.xAxis.tickFormat(function(d) {

                    var dx = data[0].values[d] && data[0].values[d][0] || 0;
                    if (dx == 0)
                      return ""
                    if( span == "month" )
                      return d3.time.format.utc('%Y-%b')(new Date(dx))
                    else
                      return d3.time.format.utc('%Y')(new Date(dx))
              });

              chart.useInteractiveGuideline = true;
              chart.tooltips=true

              chart.x2Axis.tickFormat(function(d){ 
                    var dx = data[0].values[d] && data[0].values[d][0] || 0;
                    if (dx == 0)
                      return ""
                    if( span == "month" )
                      return d3.time.format.utc('%Y-%b')(new Date(dx))
                    else
                      return d3.time.format.utc('%Y')(new Date(dx))  });

              chart.tooltipContent(function(d){
                if (d.point) {
                  var dx = d.point[0]
                  if (dx == 0)
                      return ""
                  if( span == "month" )
                    return "Specific event " + d3.time.format.utc('%Y-%b')(new Date(dx)) + " : " + d.point[1]
                  else
                     return "Specific event " + d3.time.format.utc('%Y')(new Date(dx)) + " : " + d.point[1]
                }else if ( d.data ){
                  var dx = d.data[0]
                  if( span == "month" )
                    return " Overall timeline " + d3.time.format.utc('%Y-%b')(new Date(dx)) + " : " + d.data[1]
                  else
                    return " Overall timeline " + d3.time.format.utc('%Y')(new Date(dx)) + " : " + d.data[1]
                }

              })


              d3.select('#bar-graph svg')
                .datum(getData())
                .call(chart);
              //nv.utils.windowResize(chart.update);

              return chart;
            });
        }catch(e){
            console.log("Error");
            console.log(e);
        }
        function getData() {
            var values1 = [];
            var values2 = [];
            freqs.forEach(function( obj){
              values1.push([obj.interval,obj.count]);

              if ( specificEventIntervals.length > 0 )
                values2.push([obj.interval,obj.specificCount]);
            });

            return [
                    {
                      key:"Overall timeline",
                      values: values1,
                      bar:true,
                      "yAxis": 1
                    },
                    {
                      key:"Specific Event",
                      values: values2,
                      "yAxis": 2
                    }
                  ]
            
        };
    });

}
