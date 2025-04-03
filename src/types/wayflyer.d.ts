export interface SDKConfig {
    apiKey: string;
    environment?: 'production' | 'staging' | 'development';
    debug?: boolean;
}

declare global {
    interface Window {
        WayflyerEmbedSdk: {
            renderCallToAction: () => void;
        };
        WayflyerEmbedConfig: {
            apiKey: string;
        };
    }
}
