declare const os: any;
declare const chalk: any;
declare const PLUGIN_NAME = "webpack-prompt-plugin";
declare class WebpackPromptPlugin {
    option: {
        ip: boolean;
    };
    constructor(options: any);
    getIP: () => string;
    printIP: (devServer: any) => void;
    apply: (compilation: any) => void;
}
