import Mock from 'mockjs';

const Random = Mock.Random;

const _gradeNames = [
  '一年级', '二年级', '三年级', '四年级', '五年级', '六年级',
  '初一', '初二', '初三',
  '高一', '高二', '高三',
];

const _gNames = [ '一年级', '二年级', '三年级', '四年级', '五年级', '六年级' ];

const schoolNames = new Array(500).fill('').map(() => Mock.mock('@ctitle(5)学校'));

const gradeNames = [...schoolNames.map((sname) => {
  let n = 0;
  let gnames = [];
  while (n < 6) {
    gnames.push(sname + _gNames[n]);
    n++;
  }
  return gnames;
})].flat();

const classNames = [...gradeNames.map((gname) => {
  let n = 0;
  let cnames = [];
  while (n < 50) {
    n++;
    cnames.push(gname + n + '班');
  }
  return cnames;
})].flat();

const generMockSchool = () => {
  return Mock.mock({
    'list|4': [
      {
        "type": 0,
        "schoolId|+1": 1,
        "schoolName|+1": schoolNames,
        "schoolCode": /[A-Z]{2}\d{19}/,
        "children|6": [
          {
            "gradeId|+1": 1,
            "gradeCode|+1": 100000,
            "gradeName|+1": gradeNames,
            "children|20": [
              {
                "classId|+1": 1,
                "classCode|+1": 1000000,
                "className|+1": classNames,
              }
            ]
          }
        ]
      }
    ],
  });
}


export {
  generMockSchool
}