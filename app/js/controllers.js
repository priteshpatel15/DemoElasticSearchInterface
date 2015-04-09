'use strict'

angular.module('elastic.controllers', [])
    .controller('SearchController', function ($scope, $modal, elastic) {

//        var SolrQuery = solr.Query();
//        var resultPager = solr.ResultPager(SolrQuery, 0);
//        var pageMin = 5;
//        var pageMax = 7;
//        var dateRange = {
//            "Last 2 Years": "[NOW/DAY-24MONTHS TO NOW/DAY]",
//            "Last 3 Years": "[NOW/DAY-36MONTHS TO NOW/DAY]"
//        };
//        var priorityRange = {
//            "100 - 1000": "[100 TO 1000]",
//            "1000 - 5000": "[1000 TO 5000]",
//            "Above 5000": "[5000 TO *]"
//        };
//
//        $scope.query = "";
//        $scope.freshness = "UNDEFINED";
//        $scope.searchField = "UNDEFINED";
//        $scope.priority = "UNDEFINED";

        var ElasticQuery = elastic.Query();
        
//        $scope.details = function (doc) {
//            var modalInstance = $modal.open({
//                templateUrl: '/assets/templates/a21Details.html',
//                controller: ModalInstanceCtrl,
//                resolve: {
//                    doc: function () {
//                        return doc;
//                    }
//                }
//            });
//        };

//        var ModalInstanceCtrl = function ($scope, $modalInstance, doc) {
//            $scope.doc = doc;
//        };
//
//        var postProcess = function (results) {
//            resultPager = solr.ResultPager(SolrQuery, results.SEARCHRESPONSE.TOTALCOUNT);
//            //resultPager = solr.ResultPager(SolrQuery, results.response.numFound);
//        };

//        $scope.isApplied = function (fieldName, filterValue) {
//            return SolrQuery.hasFilter(fieldName + ":" + filterValue);
//        };
//
//        $scope.updateFreshness_effective_from_date = function () {
//            //$scope.freshness = range;
//
//            if ($scope.freshness === "UNDEFINED") {
//                SolrQuery.removeFilter('freshness:');
//            } else {
//                SolrQuery.addFilter('freshness:', "effective_from_date:(" + dateRange[$scope.freshness] + ")");
//            }
//            $scope.search();
//        }
//
//        $scope.updatePriority = function () {
//            //$scope.freshness = range;
//
//            if ($scope.priority === "UNDEFINED") {
//                SolrQuery.removeFilter('priority:');
//            } else {
//                SolrQuery.addFilter('priority:', "priority:(" + priorityRange[$scope.priority] + ")");
//            }
//            $scope.search();
//        }
//
//        $scope.filterSearch = function (fieldName, filterValue) {
//
//            if (fieldName === 'Freshness') {
//                $scope.freshness = 'UNDEFINED';
//                $scope.updateFreshness_effective_from_date();
//            } else {
//                fieldName = fieldName.toLowerCase();
//
//                var filterKey = fieldName + ":" + filterValue;
//                var filterMod = fieldName + ':"' + filterValue + '"';
//
//                if ($scope.isApplied(fieldName, filterValue)) {
//                    SolrQuery.removeFilter(filterKey);
//                } else {
//                    SolrQuery.addFilter(filterKey, filterMod);
//                }
//                $scope.search();
//            }
//        };


//        $scope.search = function (pageNum) {
//            SolrQuery.start(pageNum || 0);
//            SolrQuery.rows(10);
//
//            var queryString = $scope.query || "*";
//
//            if ($scope.searchField !== 'UNDEFINED') {
//                queryString = $scope.searchField + ':(' + queryString + ')';
//            }
//
//            SolrQuery.query(queryString);
//
//            //console.log(SolrQuery.serialize());
//
//            //$scope.results = solr.http.get({}, SolrQuery.serialize(), postProcess);
//            $scope.results = solr.Resource('/search/A21').get({}, SolrQuery.serialize(), postProcess);
//        };

        $scope.search = function (pageNum) {
            //ElasticQuery.start(pageNum || 0);
            //ElasticQuery.rows(10);

            var queryString = $scope.query || "*";

            if ($scope.searchField !== 'UNDEFINED') {
                queryString = $scope.searchField + ':(' + queryString + ')';
            }

            ElasticQuery.query(queryString);

            //console.log(SolrQuery.serialize());

            //$scope.results = solr.http.get({}, SolrQuery.serialize(), postProcess);
            $scope.results = elastic.Resource('http://localhost:9200/tmp/_search').get({}, ElasticQuery.serialize());
        };

//        $scope.pager = {
//
//            pageChange: function (pageNum) {
//                $scope.search(resultPager.get(pageNum));
//            },
//
//            next: function () {
//                this.pageChange(resultPager.next());
//            },
//
//            prev: function () {
//                this.pageChange(resultPager.previous());
//            },
//
//            pageClass: function (page) {
//                return page === resultPager.current() ? "active" : "";
//            },
//
//            prevClass: function () {
//                return resultPager.current() > 1 ? "" : "disabled";
//            },
//
//            nextClass: function () {
//                return resultPager.current() < resultPager.total() ? "" : "disabled";
//            },
//
//            pages: function () {
//                return resultPager.pages(pageMin, pageMax);
//            }
//        };

        $scope.search();

        //Reactive Search
        //$scope.$watch('query', $scope.search);

    }).controller('ElasticSearchController', function ($scope, client, esFactory) {
    client.cluster.state({
        metric: [
            'cluster_name',
            'nodes',
            'master_node',
            'version'
        ]
    }).then(function (resp) {
            $scope.clusterState = resp;
            $scope.error = null;
        }).catch(function (err) {
            $scope.clusterState = null;
            $scope.error = err;
            // if the err is a NoConnections error, then the client was not able to
            // connect to elasticsearch. In that case, create a more detailed error
            // message
            if (err instanceof esFactory.errors.NoConnections) {
                $scope.error = new Error('Unable to connect to elasticsearch. ' +
                    'Make sure that it is running and listening at http://localhost:9200');
            }
        });
});