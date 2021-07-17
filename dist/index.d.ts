import { TemplateStyle } from './tpl';
interface ITip {
    text: string;
    color?: TipColor;
}
declare type TipColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray' | 'grey' | 'blackBright' | 'redBright' | 'greenBright' | 'yellowBright' | 'blueBright' | 'magentaBright' | 'cyanBright' | 'whiteBright';
interface IOptions {
    tips?: Array<ITip | string>;
    style?: TemplateStyle;
}
declare const _default: {
    new (options: IOptions): {
        isWatch: boolean;
        isStarted: boolean;
        option: {
            tips: any[];
            style: string;
        };
        getIP(): string;
        printIP(devServer: {
            host: string;
            port: number | string;
        }): void;
        printHandler(compiler: any): void;
        printCustom(): void;
        /**
         * 初始化 event 事件
         */
        initHandler(compiler: any): void;
        apply(compiler: any): void;
    };
};
export = _default;
