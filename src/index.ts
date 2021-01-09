import {
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
  ip: boolean;
  tips: Array<Itip>;
}

class WebpackPromptPlugin {
  isWatch = false
  isStarted = false
  option = {
    ip: true,
    tips: []
  }
  constructor (options: Ioptions) {
    this.option = Object.assign({}, this.option, options)
  }

  getIP = function(): string {                                                      
    return ip.address();
  }

  printIP = function(devServer: any): void {
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

  printProjectInfo = function (): void {
    console.log('name: ', chalk.underline.green(packageJson.name), '   version: ', chalk.underline.green(packageJson.version))
    console.log('\n')
  }

  printHandler = function (compiler: any): void {
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

  printCustom = function (): void {
    this.option.tips && this.option.tips.length && this.option.tips.forEach((item: Itip | string | any) => {
      const color = item.color ? item.color : 'green'
      if (typeof item === 'object') {
        console.log(chalk[color](item.name || `hello ${PLUGIN_NAME}`))
      } else {
        console.log(chalk.green(item || `hello ${PLUGIN_NAME}`))
      }
    })
  }

  initHandler = function (compiler: any): void {
    const self = this
    if (compiler.hooks) {
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

  apply = function (compiler: any) {
    this.initHandler(compiler)

    this.printHandler(compiler)
  }
}

module.exports = WebpackPromptPlugin
