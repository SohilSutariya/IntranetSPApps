(function (app) {

    var DataService = ["$http", "$filter", "SPContext",

    function ($http, $filter, SPContext) {

        var getSpLists = function () {
            var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/lists?@target='" + SPContext.hostUrl + "'&$filter=Hidden ne true";
            return $http.get(url);
        };

        // Filters is an optional array parameter in the structure:
        // [{SPColumnName: "ExampleName", SPColumnValue: "ExampleValue"}]
        // If value is a string, it should be wrapped in single quotation marks (eg: 'InActive'),
        // otherwise, if value is literal, it should be stored plain (eg: true)
        var getSpList = function (name, filters) {
            var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/lists/getbytitle('" + name + "')/items?@target='" + SPContext.hostUrl + "'&$expand=File";

            if (!angular.isUndefined(filters)) {
                url += "&$filter=";
                angular.forEach(filters, function (value, key) {
                    if (key != 0) {
                        url += " and "
                    }
                    url += "(" + value.name + " eq " + value.value + ")";
                });
            }

            return $http.get(url);
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
            var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/Lists/GetByTitle('WeatherList')/Items?@target='" + SPContext.hostUrl + "'";
            return $http.get(url);
        };

        var postTest = function () {
            // Get FormDigestValue by querying contextinfo
            // Use FormDigestValue to add item to list
            return $http.post(SPContext.appWebUrl + "/_api/contextinfo")
                .success(function (data) {
                    var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/Lists/GetByTitle('WeatherList')/Items?@target='" + SPContext.hostUrl + "'";

                    var body = {
                        '__metadata': { 'type': 'SP.Data.WeatherListListItem' },
                        'Title': "Christmas Island",
                        'Country': "Australia"
                    };

                    var headers = {
                        'Accept': 'application/json;odata=verbose',
                        'Content-Type': 'application/json;odata=verbose;',
                        'X-RequestDigest': data.d.GetContextWebInformation.FormDigestValue
                    };

                    return $http.post(url, body, { headers: headers });
                })
                .error(function (data) {
                    console.log("Failed to retrieve contextinfo: ");
                    console.log(data);
                });
        }

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

            return $http.get(url);
        };

        return {
            getSpLists: getSpLists,
            getSpList: getSpList,
            getSpListItemFileUrl: getSpListItemFileUrl,
            getCurrentUser: getCurrentUser,
            getTest: getTest,
            getSearchResults: getSearchResults,
            postTest: postTest
        };

    }];

    app.factory("DataService", DataService);

}(angular.module("app")));