# dorm_management

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


FileReader类详解
学习链接：https://sourcegraph.com/github.com/wangdoc/javascript-tutorial/-/blob/docs/bom/file.md?L92:4
1. 认识FileReader
(1)FileReader 对象用于读取 File 对象或 Blob 对象所包含的文件内容。
(2)浏览器原生提供一个`FileReader`构造函数，用来生成 FileReader 实例。
2. 语法:
   var fileReader = new FileReader();
3. FileReader对象的实例属性
   FileReader.error：读取文件时产生的错误对象
   FileReader.readyState：整数，表示读取文件时的当前状态。一共有三种可能的状态，`0`表示尚未加载任何数据，`1`表示数据正在加载，`2`表示加载完成。
   FileReader.result：读取完成后的文件内容，有可能是字符串，也可能是一个 ArrayBuffer 实例。
   FileReader.onabort：`abort`事件（用户终止读取操作）的监听函数。
   FileReader.onerror：`error`事件（读取错误）的监听函数。
   FileReader.onload：`load`事件（读取操作完成）的监听函数，通常在这个函数里面使用`result`属性，拿到文件内容。
   FileReader.onloadstart：`loadstart`事件（读取操作开始）的监听函数。
   FileReader.onloadend：`loadend`事件（读取操作结束）的监听函数。
   FileReader.onprogress：`progress`事件（读取操作进行中）的监听函数。
4. FileReader对象的实例方法
   FileReader.abort()：终止读取操作，`readyState`属性将变成`2`。
   FileReader.readAsArrayBuffer()：以 ArrayBuffer 的格式读取文件，读取完成后`result`属性将返回一个 ArrayBuffer 实例。
   FileReader.readAsBinaryString()：读取完成后，`result`属性将返回原始的二进制字符串。
   FileReader.readAsDataURL()：读取完成后，`result`属性将返回一个 Data URL 格式（Base64 编码）的字符串，代表文件内容。对于图片文件，这个字符串可以用于`<img>`元素的`src`属性。注意，这个字符串不能直接进行 Base64 解码，必须把前缀`data:*/*;base64,`从字符串里删除以后，再进行解码。
   FileReader.readAsText()：读取完成后，`result`属性将返回文件内容的文本字符串。该方法的第一个参数是代表文件的 Blob 实例，第二个参数是可选的，表示文本编码，默认为 UTF-8。