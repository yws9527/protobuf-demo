import request from '@/utils/request';
import { PBSchoolListReq, PBSchoolListRsp } from '@/protoTs/School';

// params是object类型的请求参数
// school.PBStudentListReq 是定义好的请求体model
// school.PBStudentListRsp 是定义好的响应model
// getStudentList 是接口名称
export function getSchoolList(params: PBSchoolListReq) {
  const req = request.create(PBSchoolListReq, params);
  return request('getSchoolList', req, PBSchoolListRsp);
}

// 后面如果再添加接口直接以此类推
export function getSchoolById(id: string) {
  // const req = ...
  // return request(...)
}