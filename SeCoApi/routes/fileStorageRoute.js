/**
 * Created by PhilippMac on 11.01.17.
 */
'use strict';

var ParamChecker = require('./../utility/paramChecker'),
    HeaderChecker = require('./../utility/headerChecker'),
    RpcJsonResponseBuilder = require('./../utility/rpcJsonResponseBuilder'),
    grpcFileStreamer = require('./../utility/grpcFileStreamer'),
    grpc = require('grpc'),
    auth = require('basic-auth'),
    chunk = require('chunk'),
    fs = require('fs'),
    winston = require('winston'),
    nconf = require('nconf'),
    path = require('path');


var    userClient,
    paramChecker = new ParamChecker(),
    headerChecker = new HeaderChecker();

function FileStorageRoute(configPath) {
    this.config = JSON.parse(fs.readFileSync(configPath));
    this._initFileStorageClient();
    this._initUserClient();
}

FileStorageRoute.prototype._initFileStorageClient = function () {
    var url = this.config['grpc_ip'] + ':' + this.config['grpc_port'];
    winston.log('info', '%s grpc url: %s', this.config['service_name'], url);
    var proto = grpc.load('./proto/' + 'fileStorageStream.proto')[this.config['grpc_package_name']];
    this.fileStorageClient = new proto[this.config['grpc_service_name']](url,
        grpc.credentials.createInsecure());
}

FileStorageRoute.prototype._initUserClient = function () {
    var url = nconf.get('userServiceIp') + ':' + nconf.get('userServicePort');
    winston.log('info', 'userservice grpc url for custom route: %s', url);
    var proto = grpc.load('./proto/authentication.proto').authentication;
    userClient = new proto.Authentication(url,
        grpc.credentials.createInsecure());
}

FileStorageRoute.prototype.route = function (router) {
    //Get File Route
    var serviceName = this.config.service_name.toLowerCase();
    var self = this;
    router.get('/' + serviceName + '/file', function (req, res) {
        self._getFileRoute(req, res, '/' + serviceName + '/file', 'get');
    });

    router.get('/' + serviceName + '/filetree', function (req, res) {
        self._getFileTreeRoute(req, res, '/' + serviceName + '/filetree', 'get');
    });

    router.put('/' + serviceName + '/file', function (req, res) {
        self._uploadFileRoute(req, res, '/' + serviceName + '/file', 'put');
    });

    router.post('/' + serviceName + '/file/transfer', function (req, res) {
        self._fileTransfer(req, res, '/' + serviceName + '/file/transfer', 'post');
    });

    return router;
};

FileStorageRoute.prototype._fileTransfer = function(req, res, routeUrl) {
    var self = this;
    var requestConfig = _getRequestConfig(this.config,routeUrl,req.method.toLowerCase());
    _checkQueryAndHeaderParams(req, res, requestConfig);
    _handleAuth(this.config, req.username, function (err, token) {
        if (err) {
            var result = RpcJsonResponseBuilder.buildError(err.message);
            return res.json(result);
        }
        var authToken = token;
        winston.log('info', 'authToken: ', authToken);
        var jsonGrpcArgs = _createGrpcJsonArgs(self.config, req, requestConfig['query_parameter'], requestConfig['reserved_parameter'], authToken);
        self.fileStorageClient[requestConfig['grpc_function']](jsonGrpcArgs, function (err, response) {
            if (err) {
                return _grpcError(res, self.config['service_name'], err);
            } else {
                if (response.err) {
                    winston.log('error','file transfer %s connector error response. statusCode: %s msg: %s',config.service_name,response.err.code,response.err.msg);
                    return res.status(response.err.code).send(response.err.msg);
                }
                var result = self._createHttpJsonResult(requestConfig['response_parameter'], response);
                winston.log('info', 'RPC Method %s successful.', requestConfig['grpc_function']);
                return res.json(result);
            }
        });
    });
}

FileStorageRoute.prototype._uploadFileRoute = function(req, res, routeUrl) {
    var self = this;
    var requestConfig = _getRequestConfig(this.config,routeUrl,req.method.toLowerCase());
    _checkQueryAndHeaderParams(req, res, requestConfig);
    _handleAuth(this.config, req.username, function (err, token) {
        if (err) {
            var result = RpcJsonResponseBuilder.buildError(err.message);
            return res.json(result);
        }

        var fileName = path.basename(req.query['path']);
        var dirName = path.dirname(req.query['path']);
        if(dirName === '.') dirName = '/';

        var auth = _setAuthorization(token, self.config['authentication_type']);

        var metadata = new grpc.Metadata();
        metadata.add('fileName',fileName);
        metadata.add('path',dirName);
        metadata.add('authToken',auth.token);
        var call = self.fileStorageClient[requestConfig['grpc_function']](metadata,function (err, response) {
            if (err) {
                return _grpcError(res, self.config['service_name'], err);
            } else {
                if (response.err) {
                    winston.log('error','upload File owncloud connector error response. statusCode: %s msg: %s',response.err.code,response.err.msg);
                    return res.status(response.err.code).send(response.err.msg);
                }
                var result = self._createHttpJsonResult(requestConfig['response_parameter'], response);
                winston.log('info', 'RPC Method %s successful.', requestConfig['grpc_function']);
                return res.json(result);
            }
        });
        req.on('data', function (chunk) {
            call.write({chunk: chunk});
        });

        req.on('end', function(){
            call.end();
        });
    });
}

FileStorageRoute.prototype._getFileTreeRoute = function(req, res, routeUrl) {
    var self = this;
    var requestConfig = _getRequestConfig(this.config,routeUrl,req.method.toLowerCase());
    _checkQueryAndHeaderParams(req, res, requestConfig);
    _handleAuth(this.config, req.username, function (err, token) {
        if (err) {
            var result = RpcJsonResponseBuilder.buildError(err.message);
            return res.json(result);
        }
        var authToken = token;
        winston.log('info', 'authToken: ', authToken);
        var jsonGrpcArgs = _createGrpcJsonArgs(self.config, req, requestConfig['query_parameter'], requestConfig['reserved_parameter'], authToken);
        self.fileStorageClient[requestConfig['grpc_function']](jsonGrpcArgs, function (err, response) {
            if (err) {
                return _grpcError(res, self.config['service_name'], err);
            } else {
                if (response.err) {
                    return res.status(response.err.code).send(response.err.msg);
                }
                var result = self._createHttpJsonResult(requestConfig['response_parameter'], response);
                winston.log('info', 'RPC Method %s successful.', requestConfig['grpc_function']);
                return res.json(result);
            }
        });
    });
}

FileStorageRoute.prototype._getFileRoute = function(req, res, routeUrl) {
    var self = this;
    var requestConfig = _getRequestConfig(this.config,routeUrl,req.method.toLowerCase());
    winston.log('info', requestConfig['route'] + ' route');
    _checkQueryAndHeaderParams(req, res, requestConfig);
    _handleAuth(this.config, req.username, function (err, token) {
        if (err) {
            var result = RpcJsonResponseBuilder.buildError(err.message);
            return res.json(result);
        }
        var authToken = token;
        winston.log('info', 'authToken: ', authToken);
        var jsonGrpcArgs = _createGrpcJsonArgs(self.config, req, requestConfig['query_parameter'], requestConfig['reserved_parameter'], authToken);
        var call = self.fileStorageClient.getFile(jsonGrpcArgs);
        grpcFileStreamer.receiveFileStream(res, call, ['fileName'], 'err', 'chunk');
    });
}

FileStorageRoute.prototype._createHttpJsonResult = function(params, grpcResponse) {
    var result = {};
    var noJson = false;
    result.ok = true;
    for (var i in params) {
        try {
            result[params[i]] = JSON.parse(grpcResponse[params[i]]);
        } catch (e) {
            result[params[i]] = grpcResponse[params[i]];
            noJson = true;
        }
    }
    if (noJson) {
        winston.log('error', 'connector %s responded without json', this.config['service_name']);
    }
    return result;
}

function _createGrpcJsonArgs(config, req, queryParams, reservedParams, token) {
    var grpcArgs = {};
    //encrypt authentication and set grpc parameter
    if (token) grpcArgs['auth'] = _setAuthorization(token, config['authentication_type']);
    if (queryParams) {
        var params = queryParams.concat(reservedParams);
        for (var i in params) {
            var param = params[i];
            if (param === 'userName') {
                grpcArgs['userName'] = req.username;
            } else if (req.query.hasOwnProperty(param)) {
                grpcArgs[param] = req.query[param];
            } else if (req.params.hasOwnProperty(param)) {
                grpcArgs[param] = req.params[param];
            } else if (param === 'fileName') {
                grpcArgs[param] = req.files[Object.keys(req.files)[0]].name;
            } else if (param === 'fileBuffer') {
                grpcArgs[param] = req.files[Object.keys(req.files)[0]].data;
            }
        }
    }
    return grpcArgs;
}

function _setAuthorization(token, authType) {
    var parsedToken;
    if (authType === 'OAUTH2') {
        parsedToken = token;
    } else if (authType === 'BASIC') {
        parsedToken = token;
    }
    return {token: parsedToken, type: authType};
}

function _checkQueryAndHeaderParams(req, res, config) {
    if (!paramChecker.containsParameter(config['query_parameter'], req, res)) {
        return;
    }
    if (!headerChecker.containsParameter(config['header_parameter'], req, res)) {
        return;
    }
}

function _getRequestConfig(config,routeUrl, routeFunction) {
    let requestConfigArray = config['requests'];
    for (let i = 0; i < requestConfigArray.length; i++) {
        if (requestConfigArray[i]['route'] === routeUrl && requestConfigArray[i]['http-method'] === routeFunction) {
            return requestConfigArray[i];
        }
    }
}

function _handleAuth(config, username, callback) {
    if (config.authentication_type === '') {
        return callback(null, null);
    }
    userClient.getAuthentication({
        service: config.service_name,
        username: username
    }, function (err, response) {
        if (err) {
            return callback(new Error('User service for authentication offline'));
        }
        if (response.err) {
            return callback(new Error('Authentication for ' + config.service_name + ' not set'));
        }
        return callback(null, response.token);
    });
}


module.exports = FileStorageRoute;


function _grpcError(res, serviceName) {
    return res.status(502).send(serviceName + ' service is offline');
}