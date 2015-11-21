var nameQuery = { query: {
    match: {
      description: "Alex" 
    }
  },
    aggs:{
                 "second_level" : {
                   "terms": {
                      
                   "field":"mainEntity.seller.telephone.name",
                   "size" : "30"
               }
                 }
    }
};