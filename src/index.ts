import {
  checkPortTips,
  getPkg
} from './utils';
const chalk = require('chalk')
const PLUGIN_NAME = 'webpack-prompt-plugin'
const ip = require('ip');
const packageJson = getPkg();
interface Itip {
  name: string;
  color?: string;
}

interface Ioptions {
  // 是否显示 ip 信息
  ip: boolean;

  // 文案提示信息
  tips: Array<Itip>;

  // 是否自动检测port 被占用并手动切换
  // checkPort?: boolean;

  // quiet为true 除了初始启动信息外，什么都不会写入控制台。
  // 这也意味着来自webpack的错误或警告是不可见的。
  // 默认false
  // quiet?: boolean;
}

class WebpackPromptPlugin {
  isWatch = false
  isStarted = false
  option = {
    ip: true,
    tips: [],
    checkPort: true,
    quiet: false,
  }
  constructor (options: Ioptions) {
    this.option = Object.assign({}, this.option, options);
  }

  getIP(): string {
    return ip.address();
  }

  printIP(devServer: any): void {
    // 打印返回信息
    if (this.option.ip) {
      const host = devServer.host ? (devServer.host === '0.0.0.0' ? this.getIP() : devServer.host) : 'localhost'
      const port = devServer.port || 8080;
      const text = `http://${host}:${port}/`
      console.log('\n')
      console.log(chalk.bgGreen.black(' done '), chalk.green(`App is runing!`))
      console.log('\n')
      console.log('- Local:  ', chalk.underline.blue(`http://localhost:${port}/`))
      console.log('- Network:', chalk.underline.blue(text))
      console.log('\n')
    }
  }

  printProjectInfo(): void {
    console.log('name: ', chalk.underline.green(packageJson.name), '   version: ', chalk.underline.green(packageJson.version))
    console.log('\n')
  }

  printHandler(compiler: any): void {
    const self = this
    if (compiler.hooks) {
      compiler.hooks.done.tap(PLUGIN_NAME, function(stats) {
        console.info('stats', stats.compilation.options.devServer);
        if (self.isStarted) return
        self.isStarted = true
        self.option.ip && self.isWatch && compiler['options']['devServer'] && self.printIP(compiler['options']['devServer'])
        self.printProjectInfo()
        self.printCustom()
      })
    } else {
      compiler.plugin('done', function(stats: any) {
        if (self.isStarted) return
        self.isStarted = true
        self.option.ip && self.isWatch && compiler['options']['devServer'] && self.printIP(compiler['options']['devServer'])
        self.printProjectInfo()
        self.printCustom()
      })
    }
  }

  printCustom(): void {
    this.option.tips && this.option.tips.length && this.option.tips.forEach((item: Itip | string | any) => {
      const color = item.color ? item.color : 'green'
      if (typeof item === 'object') {
        console.log(chalk[color](item.name || `hello ${PLUGIN_NAME}`))
      } else {
        console.log(chalk.green(item || `hello ${PLUGIN_NAME}`))
      }
    })
  }

  /**
   * 初始化 event 事件
   */
  initHandler(compiler: any): void {
    const self = this
    if (compiler.hooks) {
      compiler.hooks.watchRun.tap(PLUGIN_NAME, function(c) {
        self.isWatch = true
      })
      compiler.hooks.failed.tap(PLUGIN_NAME, function() {
        self.isWatch = false
        console.log(chalk.red('failed'))
      })
    } else {
      compiler.plugin('watchRun', function(c) {
        self.isWatch = true
      })
      compiler.plugin('failed', function () {
        self.isWatch = false
        console.log(chalk.red('failed'))
      })
    }
  }

  /**
   * 校验端口号
   */
  async checkPort(compiler) {
    if (!this.option.checkPort) return;
    const port = compiler.options.devServer.port || 8080;
    await checkPortTips(port, compiler);
    return compiler;
  }

  apply(compiler: any) {
    if (this.option.quiet) {
      compiler.options.devServer.quiet = true;
    }

    this.initHandler(compiler);
    this.printHandler(compiler);
  }
}

module.exports = WebpackPromptPlugin
