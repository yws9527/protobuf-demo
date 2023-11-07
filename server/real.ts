import { customAlphabet } from 'nanoid';
import { PBSchool } from '@/protoTs/School';
import { planSchool, planGrade, planClasses } from './utils';
const nanoid = customAlphabet('1234567890', 19); 

async function generTreeSchool() {
  const list: PBSchool[] = [];
  try {
    const { data: { succ, msg, data } } = await planSchool();

    if (succ) {
      const schools = (data || []).map((s: any) => {
        return {
          type: 1,
          children: [],
          schoolType: 1,
          schoolName: s.name,
          schoolCode: s.schoolCode,
          schoolId: s.id || nanoid(),
        }
      });
      for (const schoolItem of schools) {
        list.push(schoolItem);
        const { data: gradeRes } = await planGrade({ schoolCode: schoolItem.schoolCode });
        const grades = (gradeRes.data || []).map((g: any) => {
          return {
            type: 2,
            gradeName: g.gradeName,
            gradeCode: g.gradeCode,
            gradeId: g.id || nanoid(),
            children: [],
          }
        });

        for (const gradeItem of grades) {
          const { data: classRes } = await planClasses({
            schoolCode: schoolItem.schoolCode,
            gradeCode: gradeItem.gradeCode,
          });
          const classes = (classRes.data || []).map((c: any) => {
            return {
              type: 3,
              className: c.aliasName,
              classCode: c.classesCode,
              classId: c.id || nanoid(),
            };
          });
          gradeItem.children = classes;
        }
        schoolItem.children = grades;
      }
    } else {
      throw msg;
    }
  } catch (error) {
    throw error;
  }
  
  return { list };
};



export { generTreeSchool };