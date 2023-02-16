export const checkEmail = (rule: any, value: string, cb: any) => {
  //验证邮箱的正则表达式
  const regEmail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (regEmail.test(value)) {
    //合法的邮箱
    return cb();
  }
  cb(new Error("请输入合法的邮箱"));
};

export const checkTelephone = (rule: any, value: string, cb: any) => {
  //验证邮箱的正则表达式
  const regTelephone = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (regTelephone.test(value)) {
    //合法的邮箱
    return cb();
  }
  cb(new Error("请输入合法的用户名"));
};

export const checkUserName = (rule: any, value: string, cb: any) => {
  //验证邮箱的正则表达式
  const regUserName = /^\w+([-+.]\w+)*(@tcl.com)?$/;
  if (regUserName.test(value)) {
    //合法的邮箱
    return cb();
  }
  cb(new Error("请输入合法的用户名"));
};


