import tpl, { TemplateStyle } from './tpl';
import chalk from 'chalk';
import ip from 'ip';
import { performance } from 'perf_hooks';
const PLUGIN_NAME = 'webpack-prompt-plugin';

interface ITip {
  text: string;
  color?: TipColor;
}

type TipColor =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray'
  | 'grey'
  | 'blackBright'
  | 'redBright'
  | 'greenBright'
  | 'yellowBright'
  | 'blueBright'
  | 'magentaBright'
  | 'cyanBright'
  | 'whiteBright';

interface IOptions {
  // 文案提示信息
  tips?: Array<ITip | string>;

  // 提示类型
  style?: TemplateStyle;
}
const DEFAULT_OPTIONS = {
  tips: [],
  style: 'default'
};

let t: number;

export = class WebpackPromptPlugin {
  isWatch = false;
  isStarted = false;
  option = DEFAULT_OPTIONS;
  constructor(options: IOptions) {
    this.option = Object.assign({}, this.option, options);
  }

  getIP(): string {
    return ip.address();
  }

  printIP(devServer: { host: string; port: number | string }): void {
    const {
      option: { style }
    } = this;
    // 打印返回信息
    const host = devServer.host
      ? devServer.host === '0.0.0.0'
        ? this.getIP()
        : devServer.host
      : 'localhost';
    const port = devServer.port || 8080;
    tpl[style]({
      host,
      port,
      time: t
    });
  }

  printHandler(compiler: any): void {
    const self = this;
    const { isStarted } = this;

    compiler.hooks.done.tap(PLUGIN_NAME, function () {
      setTimeout(() => {
        if (isStarted) return;
        self.isStarted = true;

        if (self.isWatch) {
          self.printIP(compiler?.options?.devServer || {});
          self.printCustom();
        }
      });
    });
  }

  printCustom(): void {
    const {
      option: { tips }
    } = this;
    tips?.forEach((item: ITip | string) => {
      const color =
        typeof item !== 'string' && item.color ? item.color : 'white';
      console.log(chalk[color]((item as ITip)?.text ?? (item || '')));
    });
  }

  /**
   * 初始化 event 事件
   */
  initHandler(compiler: any): void {
    const self = this;
    compiler.hooks.watchRun.tap(PLUGIN_NAME, function (c) {
      self.isWatch = true;
    });
    compiler.hooks.failed.tap(PLUGIN_NAME, function () {
      self.isWatch = false;
      console.log(chalk.red('failed'));
    });
  }

  apply(compiler: any) {
    t = performance.now();
    this.initHandler(compiler);
    this.printHandler(compiler);
  }
};
