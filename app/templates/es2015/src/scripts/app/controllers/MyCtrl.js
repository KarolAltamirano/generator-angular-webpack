import mCtrls from './_mCtrls';
import debug from 'debug';
import loader from '../../utilities/loader';

var log = debug('Ctrls');

mCtrls.controller('MyCtrl', function ($scope) {
    log('test');
    $scope.test = 'test';
    console.log(loader.getLoader('main').getResult('app-data'));
});
