# webpack-prompt-plugin

webpack提示插件

```code
yarn add webpack-prompt-plugin
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
			tips: [
				{
					name: 'hello webpack',
					color: 'red'
				},
				'hello webpack'
			]
		})
  ],
}
```

### 参数
#### ip
是否run dev 打印ip  boolean
#### tips
提示信息队列 数组对象 或者 字符串数组都可以

**is done**
