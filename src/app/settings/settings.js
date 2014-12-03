function Config($stateProvider) {
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

function SettingsController() {
    console.log('settings controller');
}

angular
  .module('boilerplate.settings', ['ui.router'])
  .config(Config)
  .controller('SettingsController', SettingsController);
