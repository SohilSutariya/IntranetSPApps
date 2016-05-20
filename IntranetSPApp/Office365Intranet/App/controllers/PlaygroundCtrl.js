(function (app) {

    var PlaygroundCtrl = ["$scope", "DataService", "$filter",

    function ($scope, DataService, $filter) {

        $scope.spUsers = [];
        $scope.selected = {};
        $scope.selectedChoice = {};
        $scope.rptList = [];
        $scope.selectedRpt = {};

        DataService
            .getSpListProperties("test list")
            .success(function (data) {

                var rptField = $filter('filter')(data.d.Fields.results, { Title: "Safety Report" }, true);
                if (rptField.length > 0) {

                    rptField = rptField[0];

                    // Remove {} surrounding lookup id
                    var lookupField = rptField.LookupList.substring(1, rptField.LookupList.length - 1);

                    DataService
                        .getSpListById(lookupField)
                        .success(function (data) {

                            $scope.rptList = data.d.results;
                        })
                        .error(function (data) {
                            console.log("Error retrieving lookup list for Report field");
                            console.log(data);
                        });
                }

                var typesField = $filter('filter')(data.d.Fields.results, { Title: "Types" }, true);
                if (typesField.length > 0) {
                    typesField = typesField[0];
                }

                $scope.typesChoices = typesField.Choices.results;
            });

        $scope.rptSelected = function ($item, $model) {

            var odata = {
                __metadata: {
                    type: "SP.Data.Test_x0020_listListItem"
                },
                Title: "Intranet: " + $item.Title,
                Safety_x0020_ReportId: $item.Id
            };

            DataService
                .addListItem("test list", odata)
                .success(function (data) {
                    console.log("Successfully added 'test list' list item");
                })
                .error(function (data) {
                    console.log("Error adding 'test list' list item: ");
                    console.log(data);
                })
        }

        $scope.refreshSpUsers = function (searchName) {
            DataService
                .searchUsers(searchName)
                .success(function (data) {
                    console.log(data);

                    $scope.spUsers.length = 0;

                    angular.forEach(data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results, function (value, key) {
                        $scope.spUsers.push({
                            id: value.Cells.results[3].Value,
                            name: value.Cells.results[14].Value
                        });
                    });

                })
                .error(function (data) {
                    console.log("Error retrieving user list: ");
                    console.log(data);
                });
        }

        $scope.addItem = function (item, model) {

            // Checks whether the specified logon name belongs to a valid user of the website, 
            // and if the logon name does not already exist, adds it to the website.
            DataService
                .ensureUser(item.id)
                .then(function (response) {
                    console.log("Ensure Return: ");
                    console.log(response);
                    var user = response.data.d;

                    var odata = {
                        "__metadata": {
                            type: "SP.Data.Test_x0020_List_x0020_2ListItem"
                        },
                        Title: "User: " + user.Title,
                        AssignedToId: user.Id
                    }

                    DataService
                        .addListItem("Test List 2", odata)
                        .success(function (data) {
                            console.log("Item successfully added");
                        })
                        .error(function (data) {
                            console.log("Error adding item");
                            console.log(data);
                        })
                }, function (data) {
                    console.log("Error adding user to site: ");
                    console.log(data);
                });
        }

    }];

    app.controller("Playground", PlaygroundCtrl);

}(angular.module("app")));