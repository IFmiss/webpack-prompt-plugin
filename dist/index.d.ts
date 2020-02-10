declare const os: any;
declare const chalk: any;
declare const fs: any;
declare const PLUGIN_NAME = "webpack-prompt-plugin";
interface Itip {
    name: string;
    color?: string;
}
interface Ioptions {
    ip: boolean;
    tips: Array<Itip>;
}
declare class WebpackPromptPlugin {
    isWatch: boolean;
    option: {
        ip: boolean;
        tips: any[];
    };
    constructor(options: Ioptions);
    getIP: () => string;
    getPackageJson: () => any;
    printIP: (devServer: any) => void;
    printProjectInfo: () => void;
    printHandler: (compiler: any) => void;
    printCustom: () => void;
    initHandler: (compiler: any) => void;
    apply: (compiler: any) => void;
}
