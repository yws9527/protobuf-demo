
import protobuf from 'protobufjs'
import { storage } from './storage';
import httpService, { apiVersion } from '@/config/services';
import { PBMessageRequest, PBMessageResponse, PBMessageType } from '@/protoTs/MessageType';

type ImesgType = keyof typeof PBMessageType;

// 请求体message
// const PBMessageRequest = protoRoot.lookup('framework.PBMessageRequest')
// 响应体的message
// const PBMessageResponse = protoRoot.lookup('framework.PBMessageResponse')

function getMessageTypeValue(msgType: ImesgType) {
  // const PBMessageType = protoRoot.lookup('framework.PBMessageType')
  return PBMessageType[msgType];
}

/**
 * 
 * @param {*} path 接口地址
 * @param {*} msgType 接口名称
 * @param {*} responseType 返回体类型
 * @param {*} requestBody 请求体参数
 */
function request(path: string, msgType: ImesgType, responseType: any, requestBody?: Uint8Array, ) {
  // 得到api的枚举值
  const token = storage.get('token');
  const _msgType = getMessageTypeValue(msgType);

  // 请求需要的数据
  const reqData = {
    token: token,
    type: _msgType,
    version: apiVersion,
    timeStamp: Date.now(),
    messageData: requestBody,
  };
  // 将对象序列化成请求体实例
  const req = PBMessageRequest.create(reqData);
  const transformResponse = transformResponseFactory(responseType);
  httpService.defaults.headers['satoken'] = token;
  
  // 调用axios发起请求
  // 这里用到axios的配置项：transformRequest和transformResponse
  // transformRequest 发起请求时，调用transformRequest方法，目的是将req转换成二进制
  // transformResponse 对返回的数据进行处理，目的是将二进制转换成真正的json数据
  return httpService
    .post(path, req, { transformRequest, transformResponse })
    .then(({ data, status }) => {
      if (status !== 200) throw new Error('服务器异常');
      return data;
    },(err) => {
      throw err;
    })
}

// 将请求数据encode成二进制，encode是proto.js提供的方法
function transformRequest(data: PBMessageRequest) {
  return PBMessageRequest.toBinary(data);
}

function isArrayBuffer (obj: any) {
  return Object.prototype.toString.call(obj) === '[object ArrayBuffer]';
}

function transformResponseFactory(responseType: any) {
  return function transformResponse(rawResponse: number | number[] | null | undefined) {
    // 判断response是否是arrayBuffer
    if (rawResponse == null || !isArrayBuffer(rawResponse)) {
      return rawResponse;
    }
    try {
      // 请求时已设定responseType为'arraybuffer'，所以这里需要预先处理数据
      const enc = new TextDecoder('utf-8');
      const raw = JSON.parse(enc.decode(new Uint8Array(rawResponse as number[])));
      const buf = protobuf.util.newBuffer(Object.values(raw));
      // const buf = protobuf.util.newBuffer(rawResponse);
      // decode响应体
      const decodedResponse = PBMessageResponse.fromBinary(buf);
      if (decodedResponse.messageData && responseType) {
        // const model = protoRoot.lookup(responseType);
        // decodedResponse.messageData = model.decode(decodedResponse.messageData);
        decodedResponse.messageData = responseType.fromBinary(decodedResponse.messageData);
      }
      return decodedResponse;
    } catch (err) {
      throw err;
    }
  }
}

// 在request下添加一个方法，方便用于处理请求参数
request.create = function (pbConstruct: any, data: any) {
  // const pbConstruct = protoRoot.lookup(protoName);
  // return pbConstruct.encode(obj).finish();
  const _data = pbConstruct.create(data);
  return pbConstruct.toBinary(_data);
}

export default request;