'use strict';

const oauth2orize = require('oauth2orize');
const passport = require('passport');
const login = require('connect-ensure-login');
const { User, Client, AuthorizationCodes, AccessToken } = require('../models');

// Create OAuth 2.0 server
const server = oauth2orize.createServer();

const newAndSaveToken = (obj, callback) => {
    const act = new AccessToken();
    for (let i in obj) {
        act[i] = obj[i]
    }
    act.save(callback);
}

/**
 * 序列化终端
 */
server.serializeClient((client, done) => done(null, client.clientId));

/**
 * 反序列化终端
 */
server.deserializeClient((id, done) => {
    console.log('deserializeClient---', id)
    Client.getByClientId(id, done);
});

/**
 * 授权码模式
 */
server.grant(oauth2orize.grant.code((client, redirectUri, user, ares, done) => {
    const code = utils.getUid(16);
    const acs = new AuthorizationCodes()
    acs.client = client;
    acs.clientId = client.clientId;
    acs.redirectUri = redirectUri;
    acs.userId = user._id;
    acs.username = user.username;
    acs.save((err, newAcs) => {
        console.log('grant.code->', newAcs)
        if (error) return done(error);
        return done(null, code);
    })
}));

/**
 * token授权
 */
server.grant(oauth2orize.grant.token((client, user, ares, done) => {
    const token = utils.getUid(256);
    newAndSaveToken({
        token,
        userId: user._id,
        clientId: client.clientId,
    }, (error, newToken) => {
        if (error) return done(error);
        return done(null, token);
    })
}));

/**
 * 交换令牌
 */
server.exchange(oauth2orize.exchange.code((client, code, redirectUri, done) => {
    AuthorizationCodes.getByCode(code, (error, authCode) => {
        if (error) return done(error);
        if (client.clientId !== authCode.clientId) return done(null, false);
        if (redirectUri !== authCode.redirectUri) return done(null, false);

        const token = utils.getUid(256);
        newAndSaveToken({
            token,
            userId: authCode.userId,
            clientId: authCode.clientId,
        }, (error, newToken) => {
            if (error) return done(error);
            // Add custom params, e.g. the username
            let params = { username: authCode.username };
            // Call `done(err, accessToken, [refreshToken], [params])` to issue an access token
            return done(null, token, null, params);
        })
    })
}))

/**
 * 用户密码模式
 */
server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {
    Client.getByClientId(client.clientId, (error, localClient) => {
        if (error) return done(error);
        if (!localClient) return done(null, false);
        if (localClient.clientSecret !== client.clientSecret) return done(null, false);
        User.authenticate(username, password, (error, user) => {
            if (error) return done(error);
            if (!user) return done(null, false);
            // Everything validated, return the token
            const token = utils.getUid(256);
            newAndSaveToken({
                token,
                userId: user._id,
                clientId: client.clientId,
            }, (error, newToken) => {
                if (error) return done(error);
                return done(null, token);
            })
          });
    });
}))

server.exchange(oauth2orize.exchange.clientCredentials((client, scope, done) => {
    // Validate the client
    Client.getByClientId(client.clientId, (error, localClient) => {
      if (error) return done(error);
      if (!localClient) return done(null, false);
      if (localClient.clientSecret !== client.clientSecret) return done(null, false);
      // Everything validated, return the token
      const token = utils.getUid(256);
      // Pass in a null for user id since there is no user with this grant type
      newAndSaveToken({
        token,
        clientId: client.clientId,
        }, (error, newToken) => {
            if (error) return done(error);
            return done(null, token);
      })
    });
  }));

  /**
   * 用户授权
   */
  module.exports.authorization = [
    login.ensureLoggedIn(),
    server.authorization((clientId, redirectUri, done) => {
        Client.getByClientId(clientId, (error, client) => {
            if (error) return done(error);
            // WARNING: 为了安全起见，最好检查客户端提供的redirectUri与注册的redirectUri匹配。这里简化掉
            return done(null, client, redirectUri);
        });
    }, (client, user, done) => {
      // 验证该客户端是否被用户授权
      if (client.isTrusted) return done(null, true);
      
      AccessToken.getByUserAndClient(user.id, client.clientId, (error, token) => {
        // 已经被授权访问，直接返回
        if (token) return done(null, true);
        // 否则进入下一步弹窗询问
        return done(null, false);
      });
    }),
    (request, response) => {
      response.render('dialog', { transactionId: request.oauth2.transactionID, user: request.user, client: request.oauth2.client });
    },
  ];

  /**
   * 用户决策终结点。
   * 处理用户允许或拒绝访问的决定
   */
  module.exports.decision = [
    login.ensureLoggedIn(),
    server.decision(),
  ];

  /**
   * 基于所交换的授权类型，获得exchange授权用于访问令牌。客户必须向此终结点发出请求时进行身份验证。
   */
  module.exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler(),
  ];
