import {
  getPkg
} from './utils';
const detect = require('detect-port');
const inquirer = require('inquirer');
const chalk = require('chalk')
const PLUGIN_NAME = 'webpack-prompt-plugin'
const ip = require('ip');
const packageJson = getPkg();
interface Itip {
  name: string;
  color?: string;
}

interface Ioptions {
  ip: boolean;
  tips: Array<Itip>;
  checkPort?: boolean;
}

class WebpackPromptPlugin {
  isWatch = false
  isStarted = false
  option = {
    ip: true,
    tips: [],
    checkPort: true
  }
  constructor (options: Ioptions) {
    this.option = Object.assign({}, this.option, options)
  }

  getIP(): string {
    return ip.address();
  }

  printIP(devServer: any): void {
    // 打印返回信息
    if (this.option.ip) {
      const host = devServer.host ? (devServer.host === '0.0.0.0' ? this.getIP() : devServer.host) : 'localhost'
      const port = devServer.port || 80
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
      compiler.hooks.done.tap(PLUGIN_NAME, function() {
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

  initHandler(compiler: any): void {
    const self = this
    if (compiler.hooks) {
      compiler.hooks.afterPlugins.tap(PLUGIN_NAME, function(compiler) {
        self.checkPort(compiler);
        return;
      });
      compiler.hooks.watchRun.tap(PLUGIN_NAME, function() {
        self.isWatch = true
      })
      compiler.hooks.failed.tap(PLUGIN_NAME, function() {
        self.isWatch = false
        console.log(chalk.red('failed'))
      })
    } else {
      compiler.plugin('watchRun', function(compiler: any) {
        self.isWatch = true
      })
      compiler.plugin('failed', function () {
        self.isWatch = false
        console.log(chalk.red('failed'))
      })
    }
  }

  checkPort(compiler) {
    if (!this.option.checkPort) return;
    // compiler.options.devServer.port = 2000;
    const port = compiler.options.devServer.port || 80;
    detect(port, (err, _port) => {
      if (err) {
        console.log(err);
      }
      if (port === _port) {
        console.log(`port: ${port} was not occupied`);
      } else {
        inquirer.prompt([
          {
            name: 'changePort',
            type: 'confirm',
            message: `端口被占用了，切换到 ${_port}? (The port ${port} is not available, would you like to run on ${_port}?)`,
            default: true
          }
        ]).then(answer => {
          if (answer.changePort) {
            compiler.options.devServer.port = answer.changePort;
          } else {
            process.exit(0);
          }
        });
      }
    })
  }

  apply(compiler: any) {
    // check port;
    this.initHandler(compiler)
    this.printHandler(compiler)
  }
}

module.exports = WebpackPromptPlugin
