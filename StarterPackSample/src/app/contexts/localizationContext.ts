import * as React from 'react';

const LocalizationContext = React.createContext({});
const LocalizationContextProvider = LocalizationContext.Provider;
const LocalizationContextConsumer = LocalizationContext.Consumer;

export { LocalizationContextConsumer, LocalizationContextProvider };
