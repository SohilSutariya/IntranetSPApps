(function (app) {

    var DataService = ["$http", "$filter", "SPContext", 

    function ($http, $filter, SPContext) {

        // Retrieve all SharePoint HostWeb lists
        var getSpLists = function () {

            var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/lists?@target='" + SPContext.hostUrl + "'&$filter=Hidden ne true";
            return $http.get(url);

        };

        // Retrieve SharePoint list by name
        // with optional filters parameter to filter list's items
        var getSpList = function (name, filters) {
            // Filters is an array parameter in the structure:
            // [{SPColumnName: "ExampleTerm", SPColumnValue: "ExampleTerm"}]

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

        };

        // Retrieve SharePoint list by name
        // with optional filters parameter to filter list's items
        var getSpListById = function (id, filters) {
            // Filters is an array parameter in the structure:
            // [{SPColumnName: "ExampleTerm", SPColumnValue: "ExampleTerm"}]

            var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/lists(guid'" + id + "')/items?@target='" + SPContext.hostUrl + "'&$expand=File";

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

        };

        var getSpListProperties = function (name) {

            var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/lists/getbytitle('" + name + "')?@target='" + SPContext.hostUrl + "'&$expand=Fields";

            return $http.get(url);

        };

        // Add new item to list
        var addListItem = function (listName, odata) {

            // Get FormDigestValue by querying contextinfo
            return $http.post(SPContext.appWebUrl + "/_api/contextinfo")
                .success(function (data) {

                    var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)/web/Lists/GetByTitle('" + listName + "')/Items?@target='" + SPContext.hostUrl + "'";
                    var body = odata;
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

        // Retrieve the currently logged in user
        var getCurrentUser = function () {

            var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/currentuser?" + "@target='" + SPContext.hostUrl + "'";
            return $http.get(url);

        };
        
        // Search people via SharePoint Search API
        var searchUsers = function (userName) {

            // SourceID is the ID of “Local People Results” result source
            var url = SPContext.appWebUrl + "/_api/search/query?querytext='preferredname:" + userName + "*'&sourceid='B09A7990-05EA-4AF9-81EF-EDFAB16C4E31'";;
            console.log("Hitting: " + url);
            return $http.get(url);

        }

        // Returns response and not a success wrapper
        var ensureUser = function (logonName) {

            return $http.post(SPContext.appWebUrl + "/_api/contextinfo")
                .then(function (response) {

                    var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)/web/ensureuser?@target='" + SPContext.hostUrl + "'";

                    var body = {
                        logonName: logonName
                    };

                    var headers = {
                        'Accept': 'application/json;odata=verbose',
                        'Content-Type': 'application/json;odata=verbose;',
                        'X-RequestDigest': response.data.d.GetContextWebInformation.FormDigestValue
                    };

                    return $http.post(url, body, { headers: headers });

                });

        };

        var getTest = function () {
            var url = SPContext.appWebUrl + "/_api/SP.AppContextSite(@target)" + "/web/siteusers?@target='" + SPContext.hostUrl + "'&$expand=Groups";
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

            return $http.get(url);
        };

        return {
            getSpLists: getSpLists,
            getSpList: getSpList,
            getSpListById: getSpListById,
            getSpListProperties: getSpListProperties,
            getCurrentUser: getCurrentUser,
            getTest: getTest,
            getSearchResults: getSearchResults,
            addListItem: addListItem,
            searchUsers: searchUsers,
            ensureUser: ensureUser
        };

    }];

    app.factory("DataService", DataService);

}(angular.module("app")));