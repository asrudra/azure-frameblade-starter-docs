import * as React from 'react';
import { TranslationFunction } from 'i18next';

interface LocationContextInterface {
    t: TranslationFunction;
}

const LocalizationContext = React.createContext({});
const LocalizationContextProvider = LocalizationContext.Provider;
const LocalizationContextConsumer = LocalizationContext.Consumer;

export { LocationContextInterface, LocalizationContextConsumer, LocalizationContextProvider };
