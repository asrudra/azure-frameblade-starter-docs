import * as FrameBlade from 'Fx/Composition/FrameBlade';

@FrameBlade.Decorator()
export class ExperimentalBlade {
    public title = "Subscriptions";
    public subtitle = "FrameBlade Sample";
    public viewModel: FrameBlade.ViewModel;
    public context: FrameBlade.Context<{}, ExtensionDataContextType>;   

    public onInitialize() {
        const { container, parameters } = this.context;
        const viewModel = this.viewModel = new FrameBlade.ViewModel(
            container,
            {
		//todo populate relative path to index.html
                src: MsPortalFx.Base.Resources.getVersionlessContentUri()
            }
        );

        const promise = MsPortalFx.Services.getSettings().then(settings => {
            this._registerEvents(settings);
            this._registerMessageHandlers();
        });

        return Q(promise);
    }

    
    private _getArmEndpoint(): string {
	return MsPortalFx.getEnvironmentValue("armEndpoint") && MsPortalFx.getEnvironmentValue("armEndpoint").replace(/\/$/, "")
    }

    private _registerEvents(settings: MsPortalFx.Services.IGeneralSettings) {

        const theme = settings["fxs-theme"];
        const highContrastKey = settings['highContrastKey'];

        const darkTheme = 'dark';
        const lightTheme = 'light';
        const getTheme = () => {
            return highContrastKey() === 0 ?
                theme().mode == MsPortalFx.Base.Themes.ThemeMode.Dark ? darkTheme : lightTheme :
                highContrastKey() == 2 ? darkTheme : lightTheme
        };

        theme.subscribe(this.context.container, theme => {
            MsPortalFx.Services.getSettings().then(settings =>
                this.viewModel.postMessage("themeChange", {
                    requestId: "themeChange",
                    responseBody: getTheme()
                })
            );
        }).callback(theme());

        highContrastKey.subscribe(this.context.container, highContrastKey => {
            MsPortalFx.Services.getSettings().then(settings =>
                this.viewModel.postMessage("themeChange", {
                    requestId: "themeChange",
                    responseBody: getTheme()
                })
            );
        }).callback(highContrastKey());
    }

    private _registerMessageHandlers() {

        this.viewModel.on("armEndpoint", (data: any) => {
            this.viewModel.postMessage("armEndpoint", {
                requestId: data.requestId,
                responseBody: this._getArmEndpoint()
            });
        });

        this.viewModel.on("authorizationToken", (data: any) => {
                MsPortalFx.Base.Security.getAuthorizationToken().then((token) => {
                    this.viewModel.postMessage("authorizationToken", {
                        requestId: data.requestId,
                        responseBody: token.header.replace("Bearer ", "")
                    });
            });
        });

        const languageCode = 'languageCode';
        this.viewModel.on(languageCode, (data: any) => {
            this.viewModel.postMessage(languageCode, {
                requestId: data.requestId,
                responseBody: MsPortalFx.getEnvironmentValue("effectiveLocale").split(".")[0]
            });
        });

        this.viewModel.on("routeName", (data: any) => {
            this.viewModel.postMessage("routeName", {
                requestId: data.requestId,
                responseBody: 'azureSubscriptions'
            });
        });
    }
}
