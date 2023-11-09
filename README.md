# Vue 3 + TypeScript + Vite + Protobuf + Express + Mockjs

本项目是为了练习protobuf在实际开发中的使用，包含了Web端和服务端的编解码

## 打开方式

   1. 需要预先了解下Protobuf的基础知识

   2. 推荐npm全局安装esno，好处是可以直接解析运行ts而不借助其他库

## 跑起来

   1. 依赖安装

      ```sh
         pnpm i
      ```

   2. 生成protobuf文件对应的ts

      ```sh
         pnpm run protobuf
      ```

   3. 启动Web服务

      ```sh
         pnpm run dev
      ```

   4. 启动Server服务

      ```sh
         pnpm run server
      ```

## mock 或者 真实请求
   >
   > server 目录下，db.ts 是mock数据，real.ts是真实数据，可以作为借鉴。
   >
   > 目前项目比较忙，code风格比较凌乱...

## 参考地址

   1. [https://www.fengxianqi.com/index.php/archives/130/](https://www.fengxianqi.com/index.php/archives/130/)
   2. [https://www.axios-http.cn/docs/intro](https://www.axios-http.cn/docs/intro)
   3. [http://mockjs.com/](http://mockjs.com/examples.html)
   4. [https://juejin.cn/post/6936116540068593695](https://juejin.cn/post/6936116540068593695)
   5. [https://juejin.cn/post/6916164817409540104](https://juejin.cn/post/6916164817409540104)