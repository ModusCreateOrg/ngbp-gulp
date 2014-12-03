function AppController() {

    var vm = this;

    vm.user = {
        name: "Dave",
        role: "admin"
    };

}

function Config($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
}

angular
.module('boilerplate', [
    'boilerplate.about',
    'boilerplate.settings',

    'templates-app',

    'ngMaterial'
])
.config(Config)
.controller('AppController', AppController);
