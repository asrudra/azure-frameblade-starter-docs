import * as React from 'react';
import { Fabric, Customizer, createTheme } from 'office-ui-fabric-react';
import { IPartialTheme } from 'office-ui-fabric-react/lib/Styling';
import { registerActionOnChange } from './app/services/portalEnvironmentService';
import { THEME_DARK, THEME_LIGHT, SCOPED_SETTINGS } from './app/constants';

export enum Theme {
    light = 'light',
    dark = 'dark',
}

interface ThemeState {
    theme: Theme; 
    officeTheme: IPartialTheme;
}

export class Themer extends React.Component<{}, ThemeState> {

    public constructor(props: {}) {
        super(props);
        this.state = {
            officeTheme: THEME_LIGHT,
            theme: Theme.light
        };

        this.registerThemeChange();
    }

    public render(): JSX.Element {

        const currentTheme = createTheme(this.state.officeTheme);

        return (
            <Customizer settings={{ theme: { ...currentTheme }}} scopedSettings={{...SCOPED_SETTINGS}}>
                <Fabric>
                    <div className={this.state.theme === Theme.dark ? 'theme-dark' : 'theme-light'}>
                        <div className="app">
                            {this.props.children}
                        </div>
                    </div>        
                </Fabric>  
            </Customizer>
        );
    }

    private registerThemeChange() {
        
        registerActionOnChange('themeChange', (result) => {
            const theme: IPartialTheme = result === Theme.dark ? THEME_DARK : THEME_LIGHT;
            this.setState({
                officeTheme: theme,
                theme: result
                
            });
        });
    }
}