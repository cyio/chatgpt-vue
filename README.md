# ChatGPT Vue Client (no build, easy start)

背景：目前 ChatGPT 项目通常将前后端代码放在同一个项目中，需要编译和运行，而且使用了 TypeScript 等高级特性，对于新手用户来说，上手有一定难度，特别是 Vue 相关项目比较少。

因此，我们开发了这个项目，它可以简化学习和使用 ChatGPT API 的过程。

## 特点

- 采用简单的 HTML + Script，结合 Vue 3 + Options api 实现
- 代码不编译，不压缩，可直接在生产环境调试
- 界面和体验仿照 ChatGPT 官网

![image](https://user-images.githubusercontent.com/3146103/222964346-99ea6d93-e110-42bf-a98a-dd30b5f74fa7.png)


## 使用

本项目只是前端部分，需要配合接口服务使用。

请在访问时指定一次 API，会存到浏览器中。例如：`https://chatgpt.oaker.bid/?api=YOUR_SERVICE_DOMAIN/api/generate`

我们推荐的 API 服务项目是：https://github.com/ddiu8081/chatgpt-demo

## 开发

```sh
vite serve ./
``` 

以上是本项目的开发命令。