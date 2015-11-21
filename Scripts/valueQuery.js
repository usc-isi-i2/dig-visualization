var aggOnPhoneQuery = {

  
           query: {
    match: {
      "mainEntity.seller.telephone.name": "4162584934" 
    }
  },
                    
             
                 aggs: {
                     first_level:{
                terms:{
                   field : "mainEntity.availableAtOrFrom.address.addressRegion"
                }
              }
            }
              
                    
}
                 