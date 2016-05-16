(function (app) {

    var DataService = ["$http", "$filter", "SPContext", 

    function ($http, $filter, SPContext) {

        var getSpLists = function () {
            var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/lists?@target='" + SPContext.hostUrl + "'&$filter=Hidden ne true";
            return $http.get(url);
        };

        var getSpListItems = function (listId) {
            var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/lists(guid'" + listId + "')/items?@target='" + SPContext.hostUrl + "'";
            return $http.get(url);
        };

        var getSpListByName = function (name, spLists) {

            var listId = ($filter('filter')(spLists, { Title: name }, true));
            if (listId.length > 0) {
                listId = listId[0]["Id"];
            }
            else {
                listId = "00000000-0000-0000-0000-000000000000";
            }

            return getSpListItems(listId);

        }

        var getSpListItemFileUrl = function (listId, itemId) {
            var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/lists(guid'" + listId + "')/items(" + itemId + ")/file?@target='" + SPContext.hostUrl + "'";
            return $http.get(url);
        };

        var getCurrentUser = function () {
            var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/currentuser?" + "@target='" + SPContext.hostUrl + "'";
            return $http.get(url);
        };

        var getTest = function () {
            var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/Lists(guid'c6260ccb-4f58-4fa6-ac31-e1a37369a190')/Items(5)?@target='" + SPContext.hostUrl + "'";
            return $http.get(url);
        };

        var getSearchResults = function (q, pageNo, pageSize, refiners) {
            var startRow = (pageNo - 1) * pageSize;
            var url = SPContext.appWebUrl + "/_api/search/query?querytext='" + q + "'&startrow=" + startRow + "&refiners='displayauthor,filetype,lastmodifiedtime'";

            //Build/add refiners
            if (!angular.isUndefined(refiners) && refiners != null && refiners.length > 0) {
                var refinerStr = "&refinementfilters='";
                var filterStr = "";
                var refinementCount = 0;

                //Iterate through each refiner
                angular.forEach(refiners, function (value, key) {
                    var spRefinerName = "";

                    switch (value.name) {
                        case "filetype":
                            spRefinerName = "fileExtension";
                            break;
                        case "author":
                            spRefinerName = "displayauthor";
                            break;
                        default:
                            spRefinerName = "fileExtension";
                            break;
                    }

                    //Build refinement string
                    angular.forEach(value.data, function (value, key) {
                        filterStr += spRefinerName + ":equals(\"" + value + "\"),";
                        refinementCount++;
                    });

                });

                //Remove the comma at the end
                filterStr = filterStr.slice(0, filterStr.lastIndexOf(','));

                //Multiple refinements
                if (refinementCount > 1) {
                    refinerStr += "and(";
                }

                refinerStr += filterStr;

                //Multiple refinements
                if (refinementCount > 1) {
                    refinerStr += ")";
                }

                refinerStr += "'";

                url += refinerStr;
            }

            console.log("Hitting " + url);
            return $http.get(url);
        };

        return {
            getSpLists: getSpLists,
            getSpListItems: getSpListItems,
            getSpListByName: getSpListByName,
            getSpListItemFileUrl: getSpListItemFileUrl,
            getCurrentUser: getCurrentUser,
            getTest: getTest,
            getSearchResults: getSearchResults
        };

    }];

    app.factory("DataService", DataService);

}(angular.module("app")));