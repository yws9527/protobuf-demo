import express from 'express';
// import protobuf from 'protobufjs';
import { generSchools } from './db';
import { PBSchool, PBSchoolListRsp } from '@/protoTs/School';
import { PBMessageRequest, PBMessageResponse } from '@/protoTs/MessageType';

const PORT = 10086;
const app = express();

run().catch(err => console.error(err));

async function run() {
  // const root = await protobuf.load('../protobuf/School.proto');
  // const User = root.lookupType('userpackage.User');
  
  function genResponse() {
    const start = Date.now();
    const schools = generSchools();
    const end = Date.now();
    console.log('当次生成数据耗时：', ((end - start) / 1000 / 60).toFixed(2) + 'min');
    // =========== //
    const data = {
      type: 2,
      resultCode: 200,
      messageData: PBSchoolListRsp.toBinary(schools),
    };
    return PBMessageResponse.toBinary(data);
  }

  // app.get('/school', function(req, res) {
  //   res.send(User.encode(doc).finish());
  // });

  // app.post('/school', express.text({ type: '*/*' }), function(req, res) {
  //   // Assume `req.body` contains the protobuf as a utf8-encoded string
  //   const user = User.decode(Buffer.from(req.body));
  //   Object.assign(doc, user);
  //   res.end();
  // });

  app.post('/school', express.text({ type: '*/*' }), function(req, res) {
    // console.log('==========', Buffer.from(req.body));
    // Assume `req.body` contains the protobuf as a utf8-encoded string
    // const _reqData = PBMessageRequest.fromBinary(Buffer.from(req.body));
    // console.log('reqdata', _reqData);
    // const _resData = genResponse(schools);
    const _resData = genResponse();
    // console.log('respdata', _resData);
    res.send(_resData);
  });

  app.listen(PORT, () => `服务启动, 请访问：http://localhost:${PORT}`);
}