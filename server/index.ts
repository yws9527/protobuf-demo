import express from 'express';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import Colors from 'picocolors';
// import protobuf from 'protobufjs';
import { generSchools } from './db';
import { PBSchool, PBSchoolListRsp } from '@/protoTs/School';
import { PBMessageRequest, PBMessageResponse } from '@/protoTs/MessageType';
dayjs.extend(duration);

const PORT = 10086;
const app = express();

run();

function run() {
  let finished = false;
  let schools: PBSchoolListRsp | undefined;

  function genData() {
    console.log(Colors.bold(
      Colors.cyan(`🎗️ 开始生成数据...`)
    ));
    const startTime = dayjs(new Date());
    schools = generSchools();
    const endTime = dayjs(new Date());
    finished = true;
    console.log(
      Colors.bold(
        Colors.green(
          `✨ 当次生成数据耗时：${dayjs.duration(endTime.diff(startTime)).format('mm分ss秒SSS毫秒')}`
        )
      )
    );
  }
  
  function genResponse() {
    const data = {
      type: 2,
      resultCode: 200,
      messageData: PBSchoolListRsp.toBinary(schools as PBSchoolListRsp),
    };
    return PBMessageResponse.toBinary(data);
  }

  try {
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
      !finished && genData();
      const _resData = genResponse();
      // console.log('respdata', _resData);
      res.send(_resData);
    });
  } catch (error) {
    throw error;
  }


  app.listen(PORT, () => console.log(Colors.bold(
      `🚀服务启动：${Colors.blue('http://localhost:' + PORT)}`
    )
  ));
}