var nameQuery = { query: {
    match: {
      description: "Alex" 
    }
  },
    aggs:{
                 "second_level" : {
                   "terms": {
                      
                   "field":"telephone.name",
                   "size" : "30"
               }
                 }
    }
};