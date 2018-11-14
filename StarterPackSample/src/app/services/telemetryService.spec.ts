import { AppInsights } from 'applicationinsights-js';
import * as telemetryService from './telemetryService';

describe('telemetryService', () => {

    context('initialize', () => {
        it('calls AppInsights.downloadAndSetup', () => {
            telemetryService.initialize();
            expect(AppInsights.downloadAndSetup).toBeCalledTimes(1);
        });

        it('does not call AppInsights.downloadAndSetup when downloadAndSetup undefined', () => {
            AppInsights.downloadAndSetup = null;
            expect(telemetryService.initialize).not.toThrow();
        });
    });

    context('logEvent', () => {
        it('calls AppInsights.trackEvent', () => {
            const parameters = {
                eventName: 'eventName',
                measurements: {
                    eventMeasurement: 1
                },
                properties: {
                    eventProperty: 'eventPropertyValue'
                }
            };

            telemetryService.logEvent(parameters);
            expect(AppInsights.trackEvent).toHaveBeenCalledWith(
                parameters.eventName,
                parameters.properties,
                parameters.measurements
            );
        });
    });

    context('logException', () => {
        it ('calls AppInsights.logException', () => {
            const error = new Error('not implemented');
            const parameters = {
                error,
                handledAt: 'handledAt',
                measurements: {
                    errorMeasurement: 1
                },
                properties: {
                    errorProperty: 'errorProperty'
                },
                severityLevel: telemetryService.ExceptionSeverityLevel.Critical
            };

            telemetryService.logException(parameters);
            expect(AppInsights.trackException).toHaveBeenCalledWith(
                parameters.error,
                parameters.handledAt,
                parameters.properties,
                parameters.measurements,
                parameters.severityLevel
            );
        });
    });

    context('logView', () => {
        it ('calls AppInsights.trackPageView', () => {
            const parameters = {
                duration: 100,
                measurements: {
                    pageViewMeasurement: 2
                },
                properties: {
                    pageViewProperty: 'pageViewProperty'
                },
                url: undefined,
                viewName: 'mainView',
            };

            telemetryService.logPageView(parameters);
            expect(AppInsights.trackPageView).toHaveBeenCalledWith(
                parameters.viewName,
                undefined,
                parameters.properties,
                parameters.measurements,
                100
            );
        });
    });

    context('logTrace', () => {
        it ('calls AppInsights.trackTrace', () => {
            const parameters = {
                message: 'traceMessage',
                properties: {
                    traceProperty: 'traceProperty'
                },
                severityLevel: telemetryService.ExceptionSeverityLevel.Warning
            };

            telemetryService.logTrace(parameters);
            expect(AppInsights.trackTrace).toHaveBeenCalledWith(
                parameters.message,
                parameters.properties,
                parameters.severityLevel);
        });
    });
});