var aggOnPhoneQuery = {

  
           query: {
    match: {
      "mainEntity.seller.telephone.name": "" 
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
                 