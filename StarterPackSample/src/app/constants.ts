import { IPartialTheme } from 'office-ui-fabric-react/lib/Styling';

export const ADD_SUFFIX = 'ADD';
export const FETCH_GUIDED_TOUR_VISIT_SUFFIX = 'FETCH_VISIT';
export const FETCH_SUFFIX = 'FETCH';
export const MARK_GUIDED_TOUR_VISITED_SUFFIX = 'MARK_AS_VISITED';
export const SAVE_SUFFIX = 'SAVE';
export const UPDATE_SUFFIX = 'UPDATE';
export const TRANSLATION_NAMESPACE = 'translation';
export const THEME_DARK: IPartialTheme =  {
    palette: {
        black: '#f8f8f8',
        bodyBackground: '#000000',
        bodyText: '#ffffff',
        neutralDark: '#f4f4f4',
        neutralLight: '#252525',
        neutralLighter: '#151515',
        neutralLighterAlt: '#0b0b0b',
        neutralPrimary: '#ffffff',
        neutralPrimaryAlt: '#dadada',
        neutralQuaternary: '#373737',
        neutralQuaternaryAlt: '#2f2f2f',
        neutralSecondary: '#d0d0d0',
        neutralTertiary: '#c8c8c8',
        neutralTertiaryAlt: '#595959',
        themeDark: '#72bbe2',
        themeDarkAlt: '#5cafdd',
        themeDarker: '#95ccea',
        themeLight: '#173241',
        themeLighter: '#0c1b23',
        themeLighterAlt: '#030709',
        themePrimary: '#4ba6d8',
        themeSecondary: '#4393bf',
        themeTertiary: '#2e6482',
        white: '#000000',
    }
};

export const THEME_LIGHT: IPartialTheme =  {
    palette: {
        black: '#1d1d1d',
        bodyBackground: '#fff',
        bodyText: '#333',
        neutralDark: '#272727',
        neutralLight: '#eaeaea',
        neutralLighter: '#f4f4f4',
        neutralLighterAlt: '#f8f8f8',
        neutralPrimary: '#333',
        neutralPrimaryAlt: '#4b4b4b',
        neutralQuaternary: '#d0d0d0',
        neutralQuaternaryAlt: '#dadada',
        neutralSecondary: '#858585',
        neutralTertiary: '#c2c2c2',
        neutralTertiaryAlt: '#c8c8c8',
        themeDark: '#005a9e',
        themeDarkAlt: '#106ebe',
        themeDarker: '#004578',
        themeLight: '#c7e0f4',
        themeLighter: '#deecf9',
        themeLighterAlt: '#eff6fc',
        themePrimary: '#0078d4',
        themeSecondary: '#2b88d8',
        themeTertiary: '#71afe5',
        white: '#fff',
      }
};

export const SCOPED_SETTINGS = {

    Toggle: {
        styles: {
            root: {
                fontSize: '12px'
            }
        }
    },

    TextField: {
        styles: {
            root: {
                fontSize: '12px',
                selectors: {
                    input : {
                        fontSize: '12px'
                    }   
                }
            }
        }
    }
};