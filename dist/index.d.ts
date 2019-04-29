declare const os: any;
declare const chalk: any;
declare const PLUGIN_NAME = "webpack-prompt-plugin";
interface Itip {
    name: string;
    color?: string;
}
interface Ioptions {
    ip: boolean;
    tips: Itip[];
}
declare class WebpackPromptPlugin {
    isWatch: boolean;
    option: {
        ip: boolean;
        tips: {
            name: string;
            color: string;
        }[];
    };
    constructor(options: Ioptions);
    getIP: () => string;
    printIP: (devServer: any) => void;
    printIpHandler: (compilation: any) => void;
    printCustom: () => void;
    printCustomHandler: (compilation: any) => void;
    initHandler: (compilation: any) => void;
    apply: (compilation: any) => void;
}
