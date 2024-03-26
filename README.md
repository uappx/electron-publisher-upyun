## electron-publisher-upyun

使用又拍云作为 electron 的版本发布

### 安装

```bash
npm i --save-dev @uappx/electron-publisher-upyun
```

```javascript title=forge.config.js
module.exports = {
  // ...
  publishers: [
    {
      name: '@uappx/electron-publisher-upyun',
      config: {
        service: '',  // 又拍云的 service
        operator: '', // 又拍云的 operator
        password: '', // operator 对应的密码
        prefix: 'release', // 云存储的路径前缀
      }
    }
  ]
}
```
