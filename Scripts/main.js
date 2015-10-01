define(['Scripts/d3.v3', 'Scripts/elasticsearch'], function (d3, elasticsearch) {
    "use strict";

    var client = new elasticsearch.Client({
        host: 'http://localhost:9200/',
       
       
    });
    client.search({
    	index: 'dig',
  		type: 'WebPage',
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
});