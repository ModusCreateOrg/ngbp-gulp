(function() {

    function AppController() {

        // viewModel. bind here to avoid 'this' (and having to use .bind() to change `this`
        // context, and issues inside other function calls.
        var vm = this;

        vm.coolThings = [
            'gulp',
            'Material',
            'Angular'
        ];

    }

    angular
        .module('modusBoilerplate', ['ngMaterial'])
        .controller('AppController', AppController);

})();
