/* @ngInject */
function AboutConfig($stateProvider) {
  $stateProvider.state('about', {
      url: '/about',
      views: {
          'main': {
              controller: 'AboutController',
              controllerAs: 'about',
              templateUrl: 'about/about.tpl.html'
          }
      }
  });
}

/* @ngInject */
function AboutController() {
  var vm = this;
}

angular
  .module('boilerplate.about', ['ui.router'])
  .config(AboutConfig)
  .controller('AboutController', AboutController);
