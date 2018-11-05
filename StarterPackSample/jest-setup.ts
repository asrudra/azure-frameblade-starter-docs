import 'raf/polyfill'; // requestAnimationFrame() required by react v16+
import { setIconOptions } from 'office-ui-fabric-react/lib/Styling';
import * as _Window from './node_modules/jsdom/lib/jsdom/browser/Window';
let enzyme: any = require('enzyme'); // tslint:disable-line: no-any
let Adapter: any = require('enzyme-adapter-react-16'); // tslint:disable-line: no-any

// Suppress icon warnings.
setIconOptions({
  disableWarnings: true
});

enzyme.configure({ adapter: new Adapter() });
window.parent.postMessage = jest.fn();  // portalEnvironmentService
window.parent.addEventListener = jest.fn(); // portalEnvironmentService