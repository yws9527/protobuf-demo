
import protobuf from 'protobufjs'
import httpService, { token, apiVersion } from '@/config/services';
import { PBSchool, PBSchoolListReq, PBSchoolListRsp } from '@/protoTs/School';
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
 * @param {*} msgType 接口名称
 * @param {*} requestBody 请求体参数
 * @param {*} responseType 返回值
 */
function request(path: string, msgType: ImesgType, requestBody: Uint8Array, responseType: any) {
  // 得到api的枚举值
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
  
  // 调用axios发起请求
  // 这里用到axios的配置项：transformRequest和transformResponse
  // transformRequest 发起请求时，调用transformRequest方法，目的是将req转换成二进制
  // transformResponse 对返回的数据进行处理，目的是将二进制转换成真正的json数据
  return httpService
    .post(path, req, { transformRequest, transformResponse })
    .then(({ data, status }) => {
      // 对请求做处理
      if (status !== 200) {
        const err = new Error('服务器异常');
        throw err;
      }
      console.log(data);
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

const schools: PBSchoolListRsp = {
  list: [
    {
      type: 1,
      schoolType: 1,
      schoolName: '安义县实验小学',
      schoolCode: 'SC1700046774034571264',
      schoolId: '1700046774001016832',
      children: [],
    }
  ]
};

function genResponse(data: PBSchoolListRsp) {
  const data2 = {
    type: 0,
    resultCode: 200,
    messageData: PBSchoolListRsp.toBinary(data),
  };
  return PBMessageResponse.toBinary(data2);
}

function transformResponseFactory(responseType: any) {
  return function transformResponse(rawResponse: number | number[] | null | undefined) {
    // 判断response是否是arrayBuffer
    if (rawResponse == null || !isArrayBuffer(rawResponse)) {
      return rawResponse;
    }
    try {
      const enc = new TextDecoder('utf-8');
      const raw = JSON.parse(enc.decode(new Uint8Array(rawResponse as number[])));
      const buf = protobuf.util.newBuffer(Object.values(raw));
      // const buf = protobuf.util.newBuffer(rawResponse);
      // const buf = genResponse(schools);
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
request.create = function (pbConstruct: any, obj: any) {
  // const pbConstruct = protoRoot.lookup(protoName);
  // return pbConstruct.encode(obj).finish();
  const _obj = pbConstruct.create(obj);
  return pbConstruct.toBinary(_obj);
}

export default request;