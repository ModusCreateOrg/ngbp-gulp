/* @ngInject */
function SettingsConfig($stateProvider) {
  $stateProvider.state('settings', {
      url: '/settings',
      views: {
          'main': {
              controller: 'SettingsController',
              templateUrl: 'settings/settings.tpl.html'
          }
      }
  });
}

/* @ngInject */
function SettingsController() {
    console.log('settings controller');
}

angular
  .module('boilerplate.settings', ['ui.router'])
  .config(SettingsConfig)
  .controller('SettingsController', SettingsController);
