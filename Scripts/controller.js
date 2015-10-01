angular.module('controllers', [])
    .controller('SearchCtrl', function($scope) {

    	  var ejs = ejsResource('http://localhost:9200');

    	  var oQuery = ejs.QueryStringQuery().defaultField('Title');

        var client = ejs.Request()
            .indices('dig')
            .types('WebPage');

        $scope.search = function() {
            $scope.results = client
                .query(oQuery.query($scope.queryTerm || '*'))
                .doSearch();
        };


    });