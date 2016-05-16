(function (app) {


    var SearchCtrl = ["$scope", "$filter", "DataService",

        function ($scope, $filter, DataService) {

            $scope.currentPage = 1;
            $scope.totalItems = 0;
            $scope.maxSize = 5; //Number of pages to display in pagination
            $scope.pageSize = 10;
            $scope.startItemNo = 0;
            $scope.results = {};
            $scope.activeRefiners = [];
            $scope.refiners = [];
            $scope.expanded = [];
            $scope.searching = false;


            /** SEARCH **/
            $scope.search = function () {
                if ($scope.searchQuery != "") {
                    $scope.searching = true;
                    $scope.totalItems = 0;

                    DataService
                        .getSearchResults($scope.searchQuery, $scope.currentPage, $scope.pageSize, $scope.activeRefiners)
                        .success(function (data) {
                            console.log("Retrieved search results successfully: ");
                            console.log(data);

                            //Drill down SharePoint object to retrieve results
                            $scope.query = data.d.query.PrimaryQueryResult;
                            if ($scope.query.RelevantResults != null) {
                                $scope.totalItems = $scope.query.RelevantResults.TotalRows;
                                $scope.results = $scope.query.RelevantResults.Table.Rows.results;
                                $scope.startItemNo = ($scope.currentPage - 1) * $scope.pageSize + 1;
                                if ($scope.startItemNo + ($scope.pageSize - 1) < $scope.totalItems) {
                                    $scope.endItemNo = $scope.startItemNo + ($scope.pageSize - 1);
                                }
                                else {
                                    $scope.endItemNo = $scope.totalItems;
                                }
                            }
                            else {
                                $scope.results = {};
                                $scope.totalItems = 0;
                            }

                            //Set up refiners
                            if ($scope.query.RefinementResults) {
                                $scope.fileTypes = ($filter('filter')($scope.query.RefinementResults.Refiners.results, { Name: "filetype" }, true));
                                if ($scope.fileTypes.length > 0) {
                                    //Check for existing refiner
                                    var refinerIdx = findByAttr($scope.refiners, "name", "filetype");
                                    if (!angular.isUndefined(refinerIdx)) {
                                        //Remove existing refiner
                                        $scope.refiners.splice(refinerIdx, 1);
                                    }
                                    $scope.refiners.push({ name: "filetype", data: $scope.fileTypes[0].Entries.results });
                                }

                                $scope.authors = ($filter('filter')($scope.query.RefinementResults.Refiners.results, { Name: "displayauthor" }, true));
                                if ($scope.authors.length > 0) {
                                    //Check for existing refiner
                                    var refinerIdx = findByAttr($scope.refiners, "name", "author");
                                    if (!angular.isUndefined(refinerIdx)) {
                                        //Remove existing refiner
                                        $scope.refiners.splice(refinerIdx, 1);
                                    }
                                    $scope.refiners.push({ name: "author", data: $scope.authors[0].Entries.results });
                                }
                            }

                            $scope.searching = false;
                        })
                        .error(function (error) {
                            console.log("Failed to retrieve search results.");
                            console.log(error);

                            $scope.searching = false;
                        });
                }
                else {
                    //No search term entered
                    $scope.results = {};
                    $scope.totalItems = 0;
                }
            }

            $scope.pageChanged = function () {
                $scope.search();
            };

            $scope.updateSearch = function () {
                // User types in a new search term, LayoutCtrl search bar should be updated
                $scope.$emit("updateSearch", { q: $scope.searchQuery });
                $scope.newSearch();
            }

            $scope.newSearch = function () {
                $scope.currentPage = 1;
                $scope.refiners.length = 0;
                $scope.activeRefiners.length = 0;
                $scope.search();
            };

            $scope.newSearch();
            /** /SEARCH **/


            /** REFINERS **/
            $scope.isExpanded = function (refiner) {
                //Check if refiner list shows all refiners
                return $scope.expanded.indexOf(refiner) > -1;
            }

            $scope.isActiveRefiner = function (refiner, refinement) {
                if (angular.isUndefined(refinement)) {
                    //Check for active refiner
                    return !angular.isUndefined(findByAttr($scope.activeRefiners, "name", refiner));
                }
                else {
                    //Check for active refinement

                    //Check if refiner is active
                    var refinerIdx = findByAttr($scope.activeRefiners, "name", refiner);

                    if (!angular.isUndefined(refinerIdx)) {
                        //Refiner is active, find refinement
                        var refinementIdx = $scope.activeRefiners[refinerIdx].data.indexOf(refinement);

                        if (refinementIdx != -1) {
                            //refinement is active
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        //Refiner is not active
                        return false;
                    }
                }
            }

            $scope.expandToggle = function (refiner) {
                if ($scope.isExpanded(refiner)) {
                    //Refiner is currently expanded, remove from expanded list
                    $scope.expanded.splice($scope.expanded.indexOf(refiner), 1);
                }
                else {
                    //Refiner not currently expanded, add to expanded list
                    $scope.expanded.push(refiner);
                }
            }

            $scope.refineSearch = function (refinement, refiner) {

                //Get index of refiner if its active, undefined if not active
                var refinerIdx = findByAttr($scope.activeRefiners, "name", refiner);

                if (!angular.isUndefined(refinerIdx)) {
                    //refiner exists
                    var activeRefiner = $scope.activeRefiners[refinerIdx];

                    if (refinement == null || refinement.length < 1) {
                        //refinement is null/empty, remove refinement
                        $scope.activeRefiners.splice(refinerIdx, 1);
                    }
                    else {
                        var refinementIdx = activeRefiner.data.indexOf(refinement);

                        if (refinementIdx != -1) {
                            //refinement already exists, remove refinement
                            activeRefiner.data.splice(refinementIdx, 1);

                            if (activeRefiner.data.length == 0) {
                                //no other elements in refiner
                                $scope.activeRefiners.splice(refinerIdx, 1);
                            }
                        }
                        else {
                            //refiner exists, but refinement doesn't, add refinement
                            $scope.activeRefiners[refinerIdx].data.push(refinement);
                        }
                    }
                }
                else if (refinement != null && refinement.length > 0 && refiner != null && refiner.length > 0) {
                    //refiner doesn't exist, add refiner and refinement
                    $scope.activeRefiners.push({ name: refiner, data: [refinement] });
                }

                //Perform search
                $scope.currentPage = 1;
                $scope.search();
            };
            /** /REFINERS **/


            /* Events */

            //Broadcast from LayoutCtrl
            $scope.$on("updateSearch", function (event, data) {
                $scope.searchQuery = data.q;
                $scope.newSearch();
            });
            /* /Events */

        }];

    app.controller("SearchCtrl", SearchCtrl);


})(angular.module("app"));