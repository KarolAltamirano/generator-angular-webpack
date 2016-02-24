import getModuleInstance from '../utilities/getModuleInstance';
import ngAnimate from 'angular-animate';

/**
 * Create animations module
 */

var mAnimations = getModuleInstance('mAnimations', [ngAnimate]);

export default mAnimations;
