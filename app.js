(function () {
  "use strict";

  angular
    .module("NarrowItDownApp", [])
    .controller("NarrowItDownController", NarrowItDownController)
    .service("MenuSearchService", MenuSearchService)
    .directive("foundItems", FoundItemsDirective)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

  function FoundItemsDirective() {
    return {
      templateUrl: "foundList.html",
      scope: {
        items: "<",
        onRemove: '&',
        searchPerformed: "<"
      },
      controller: NarrowItDownController,
      controllerAs: "ctrl",
      bindToController: true,
    }
  }

  NarrowItDownController.$inject = ["MenuSearchService"];
  function NarrowItDownController(MenuSearchService) {
    const ctrl = this;
    ctrl.searchPerformed = false;
    ctrl.searchTerm = ""
    ctrl.found = []
    ctrl.dontWant = []

    ctrl.onNarrowDown = function () {
      ctrl.searchPerformed = true
      MenuSearchService.getMatchedMenuItems(ctrl.searchTerm).then( function (foundList){
          ctrl.found = foundList
      }).finally(function() {
      })
    }

    ctrl.onDontWant = function (index) {
      ctrl.found.splice(index,1)
    }
  }

  MenuSearchService.$inject = ["$http", "ApiBasePath"];
  function MenuSearchService($http, ApiBasePath) {
    let service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      if (searchTerm === "") {
        return Promise.resolve([])
      }

      return $http({
        method: "GET",
        url: ApiBasePath + "/menu_items.json",
      })
        .then(function (response) {
          return response.data["menu_items"]
            .filter(item => {
              return item.description.toLowerCase().includes(searchTerm.toLowerCase())
            })
        })
        .catch(function (error) {
          console.log("Something went wrong: " + error);
        });
    }
  }
})();