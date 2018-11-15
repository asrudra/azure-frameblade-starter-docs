import 'babel-polyfill';
import { Provider } from 'react-redux';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { I18nextProvider, withNamespaces } from 'react-i18next';
import * as i18next from 'i18next';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { Router } from './router';
import { Themer } from './themer';
import './css/main.scss';
import { EnvironmentSettingNames } from './app/services/models/environmentSettingNames';
import { getSetting } from './app/services/portalEnvironmentService';
import resources from './localization/resources';
import store from './app/redux/store';
import { initialize as initializeTelemetryService } from './app/services/telemetryService';
import { LocalizationContextProvider } from './app/contexts/localizationContext';
import { TRANSLATION_NAMESPACE } from './app/constants';

const currentLanguage = 'en'; // should come from Azure Portal
const fallbackLanguage = 'en';

initializeIcons();
initializeCurrentLanguage();
initializeTelemetryService();

i18next.init({
  fallbackLng: fallbackLanguage,
  interpolation: { escapeValue: false },  // React already does escaping
  lng: currentLanguage,
  parseMissingKeyHandler: (key: string) => {
      return `No translation found for "${key}"`;
  },
  resources,
});

const ViewHolder = (translationObject: any) => (// tslint:disable-line: no-any
  <I18nextProvider i18n={i18next}>
      <Provider store={store}>
        <LocalizationContextProvider value={{t: translationObject.t}}>
          <Themer>
            <Router/>
          </Themer>
        </LocalizationContextProvider>
      </Provider>
  </I18nextProvider>
);

const App = withNamespaces(TRANSLATION_NAMESPACE)(ViewHolder);

ReactDOM.render(
    <App/>, document.getElementById('reactTarget')
);

function initializeCurrentLanguage() {

  getSetting(EnvironmentSettingNames.LANGUAGE_CODE).then((result) => {
    i18next.changeLanguage(result, (err, t) => {
        return t;
    });
  });
}
