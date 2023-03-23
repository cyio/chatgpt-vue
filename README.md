# ChatGPT Vue Client (no build, easy start)

[中文说明](./README-zh.md)

Background: Currently, the ChatGPT project usually puts the front-end and back-end code in the same project, which requires compilation and running, and uses advanced features such as TypeScript. For novice users, it is difficult to get started, especially for Vue-related projects that are relatively rare.

Therefore, we have developed this project, which can simplify the process of learning and using the ChatGPT API.

## Features

- Using simple HTML + Script, combined with Vue 3 + Options API implementation
- The code is not compiled or compressed, and can be debugged directly in the production environment
- The interface and experience are modeled after the ChatGPT official website

<img width="969" alt="image" src="https://user-images.githubusercontent.com/3146103/227228928-3256c1d0-fc4b-4880-865b-3efb2b1b326e.png">


## Usage

This project is only the front-end part and needs to be used with the server service.

We recommend using the API service project: https://github.com/ddiu8081/chatgpt-demo

## Development

```sh
vite serve ./
``` 

The above is the development command for this project.