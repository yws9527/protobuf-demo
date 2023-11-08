import { PBMessageResponse } from '@/protoTs/MessageType';

export function errorHandle(res: any, error: any) {
  const resdata = PBMessageResponse.toBinary({
    type: 1,
    resultInfo: error?.msg,
    resultCode: Number(error?.code),
  });

  res.send(resdata);
}