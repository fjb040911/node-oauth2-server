# node-oauth2-server

node-oauth2-server 是一个基于 Node.js 的认证服务. 结合了 [Passport](http://passportjs.org/)
的身份验证策略和应用程序的路由处理, 可直接被部署用于提供 [OAuth 2.0](http://tools.ietf.org/html/rfc6749)
认证协议. 基于Mongodb做持久化

## Install

    $ npm install 

## Usage

OAuth 2.0定义了一个授权框架，允许用于交换访问令牌的授权授权。
这里以下四种模式都支持
授权码模式（authorization code）
简化模式（implicit）
密码模式（resource owner password credentials）
客户端模式（client credentials）

API
===

以下是passport-strategy认证策略的API

* `/dialog/authorize` is the `authorizationURL`.
* `/oauth/token` is the `tokenURL`


* `GET /login` lets you login, presented by `/dialog/authorize` if you haven't logged in
* `POST /login` processes the login

* `POST /dialog/authorize/decision`, processes the allow / deny

## Demo和部分页面正在完善中
