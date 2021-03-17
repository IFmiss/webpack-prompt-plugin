# webpack-prompt-plugin

webpack提示插件
安装
```code
yarn add webpack-prompt-plugin --dev
```

或者
```code
npm install webpack-prompt-plugin --save-dev
```

```js
const webpackPromptPlugin = require('webpack-prompt-plugin');

module.exports = {
  // ...
  plugins: [
    new webpackPromptPlugin()
  ],
}

// 带参数
module.exports = {
  // ...
  plugins: [
    new WebpackPromptPlugin({
      ip: true,
      tips: [{
        name: 'hello webpack',
        color: 'red'
      },
      'hello webpack'
     ],
     })
  ],
}
```

### 参数
#### ip
是否run dev 打印ip  boolean
#### tips
提示信息队列 数组对象 或者 字符串数组都可以
