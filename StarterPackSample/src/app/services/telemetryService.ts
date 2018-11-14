import { AppInsights } from 'applicationinsights-js';

export function initialize() {
    if (AppInsights.downloadAndSetup) {
        AppInsights.downloadAndSetup({ instrumentationKey: 'enter key'});
    }
}

export interface LogEventParameters {
    eventName: string;
    measurements?:  { [name: string]: number };
    properties?:  { [name: string]: string };
}
export function logEvent(parameters: LogEventParameters) {
    AppInsights.trackEvent(
        parameters.eventName, 
        parameters.properties, 
        parameters.measurements);
}

export enum ExceptionSeverityLevel {
    Critical = 4,
    Error = 3,
    Information = 2,
    Verbose = 1,
    Warning = 0
}
export interface LogExceptionParameters {
    error: Error;
    handledAt: string;
    measurements?:  { [name: string]: number };
    properties?:  { [name: string]: string };
    severityLevel: ExceptionSeverityLevel;
}
export function logException(parameters: LogExceptionParameters) {
    AppInsights.trackException(
        parameters.error, 
        parameters.handledAt, 
        parameters.properties, 
        parameters.measurements, 
        parameters.severityLevel.valueOf());
}

export interface LogPageViewParameters {
    duration?: number;
    measurements?:  { [name: string]: number };
    properties?:  { [name: string]: string };
    url?: string;
    viewName: string;
    
}
export function logPageView(parameters: LogPageViewParameters) {
    AppInsights.trackPageView(
        parameters.viewName, 
        parameters.url, 
        parameters.properties, 
        parameters.measurements,
        parameters.duration);
}

export interface LogTraceParameters {
    message: string;
    properties?:  { [name: string]: string };
    severityLevel: ExceptionSeverityLevel;
}
export function logTrace(parameters: LogTraceParameters) {
    AppInsights.trackTrace(parameters.message, parameters.properties, parameters.severityLevel.valueOf()); 
}