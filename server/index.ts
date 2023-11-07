import express from 'express';
import dayjs from 'dayjs';
import Colors from 'picocolors';
import { globalMap, service } from './utils';
// import protobuf from 'protobufjs';
import duration from 'dayjs/plugin/duration';
import { generMockSchool } from './db';
import { generTreeSchool } from './real';
import { PBSchool, PBSchoolListRsp } from '@/protoTs/School';
import { PBMessageRequest, PBMessageResponse } from '@/protoTs/MessageType';
dayjs.extend(duration);

const PORT = 10086;
const app = express();

run();

function run() {
  let finished = false;
  let mockSchools: PBSchoolListRsp | undefined;
  let treeSchools: PBSchoolListRsp | undefined;

  async function genData(type: number, reqCallback: () => PBSchoolListRsp | Promise<PBSchoolListRsp>) {
    console.log(Colors.bold(
      Colors.cyan(`🎗️ 开始生成数据...`)
    ));
    const startTime = dayjs(new Date());
    if (type === 1) mockSchools = reqCallback() as PBSchoolListRsp;
    if (type === 2) treeSchools = await reqCallback();
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
  
  function genResponse(school: PBSchoolListRsp | undefined) {
    const data = {
      type: 2,
      resultCode: 200,
      messageData: PBSchoolListRsp.toBinary(school!),
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
      !finished && genData(1, generMockSchool);
      const _resData = genResponse(mockSchools);
      // console.log('respdata', _resData);
      res.send(_resData);
    });

    app.post('/schoolTree', express.text({ type: '*/*' }), async function(req, res) {
      // console.log('==========', req.headers);
      if (req.headers.satoken) {
        globalMap.set('satoken', req.headers.satoken);
        service.defaults.headers['satoken'] = req.headers.satoken;
        // Assume `req.body` contains the protobuf as a utf8-encoded string
        // const _reqData = PBMessageRequest.fromBinary(Buffer.from(req.body));
        // console.log('reqdata', _reqData);
        // const _resData = genResponse(schools);
        !finished && await genData(2, generTreeSchool);
        console.log('tree', treeSchools);
        const _resData = genResponse(treeSchools);
        // console.log('respdata', _resData);
        res.send(_resData);
      } else {
        res.send(PBMessageResponse.toBinary({
          type: 1,
          resultCode: 902,
          resultInfo: '未登录'
        }));
      }
    });
  } catch (error) {
    throw error;
  }


  app.listen(PORT, () => console.log(Colors.bold(
      `🚀服务启动：${Colors.blue('http://localhost:' + PORT)}`
    )
  ));
}