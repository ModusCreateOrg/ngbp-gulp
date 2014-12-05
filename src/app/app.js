/* @ngInject */
function AppController() {

    var vm = this;

    vm.user = {
        name: "Dave",
        role: "admin"
    };

}

/* @ngInject */
function AppConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
}

angular
.module('boilerplate', [
    'boilerplate.about',
    'boilerplate.settings',

    'templates-app',

    'ngMaterial'
])
.config(AppConfig)
.controller('AppController', AppController);
