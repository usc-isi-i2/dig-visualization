var numDateQuery = {query: {
    match: {
      "mainEntity.seller.telephone.name": "" 
    }
  },
                    
             
               aggs:{
                 second_level : {
                   date_histogram: {
                 field:"dateCreated",
                 format : "yyyy-MM-dd'T'HH:mm:ss",
                 interval : "month"
               }
                 }
               }
              
                    
                 }