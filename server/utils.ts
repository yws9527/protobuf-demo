import axios from 'axios';
const host = 'http://120.79.6.11:9527';

export const service = axios.create({
  timeout: 1 * 60 * 60 * 1000,
  baseURL: host,
  headers: {
    'satoken': '',
    'Content-Type': 'application/json',
  },
});

const urls = {
  planSchool: '/pt/plan/school',    // 查询渠道商学校列表 get
  planGrade: '/pt/plan/grade',      // 查询渠道商学校年级列表 get
  planClasses: '/pt/plan/classes',  // 查询渠道商学校班级列表 get
};

export const globalMap = new Map();

export const planSchool = (): HttpResponse<ApiResponse> =>
  service.request({
    method: 'get',
    url: urls.planSchool,
  }) as unknown as HttpResponse<ApiResponse>;

export const planGrade = (data: { schoolCode: string }): HttpResponse<ApiResponse> =>
  service.request({
    params: data,
    method: 'get',
    url: urls.planGrade,
  }) as unknown as HttpResponse<ApiResponse>;

export const planClasses = (data: { schoolCode: string; gradeCode: string }): HttpResponse<ApiResponse> =>
  service.request({
    params: data,
    method: 'get',
    url: urls.planClasses,
  }) as unknown as HttpResponse<ApiResponse>;
