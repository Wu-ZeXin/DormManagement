import requests from "./request";

// 验证登录信息并返回用户数据、用户管理权限
export const reqLoginInfo = (data) => requests({url:'/login', method:'post', data })

// 更新用户数据
export const reqUpdateUserData = (data) => requests({url: '/login/update', method: "post", data })

// 查询楼宇列表信息
export const reqLyListInfo = (data) => requests({ url: '/newly', method: 'post', data })

// 查询楼宇名字
export const reqBuildNumber = () => requests({ url: '/newly/lyname', method: 'post' })

// 依据楼宇号以及负责人查询信息
export const reqBuildHeaderInfo = (data) => requests({ url: '/newly/search', method: 'post', data })

// 添加楼宇信息
export const reqAddBuildHeader = (data) => requests({ url: '/newly/add', method: 'post', data })

// 删除楼宇负责人信息
export const reqDeleteBuildHeader = (data) => requests({ url: '/newly/delete', method: 'post', data })

// 编辑楼宇负责人信息
export const reqEditBuildHeader = (data) => requests({ url: '/newly/edit', method: 'post', data })

// 查询宿舍列表信息
export const reqDormList = (data) => requests({ url: '/dormList/search', method: 'post', data })

// 向宿舍添加学生
export const reqAddStudent = (data) => requests({ url: '/dormList/adduser', method: 'post', data })

// 从宿舍删除学生
export const reqDeleteStudent = (data) => requests({ url: '/dormList/del', method: 'post', data })

// 编辑学生
export const reqEditStudent = (data) => requests({ url: '/dormList/edit', method: 'post', data })

// 获取用户权限列表
export const reqUserList = (data) => requests({ url: '/yhqx/search', method: 'post', data })

// 添加用户
export const reqAddUser = (data) => requests({ url: '/yhqx/add', method: 'post', data })

// 删除用户
export const reqDeleteUser = (data) => requests({ url: '/yhqx/del', method: 'post', data })

// 修改用户
export const reqEditUser = (data) => requests({ url: '/yhqx/edit', method: 'post', data })

// 查询学生列表信息
export const reqStuList = (data) => requests({ url: '/xslb/search', method: 'post', data })

// 向学生列表添加学生信息
export const reqAddStuToList = (data) => requests({ url: '/xslb/add', method: 'post', data })

// 从学生列表删除学生信息
export const reqDeleteStuList = (data) => requests({ url: '/xslb/del', method: 'post', data})

// 修改学生列表学生信息
export const reqEditStuList = (data) => requests({ url: '/xslb/edit', method: 'post', data})

// 查询保修列表信息
export const reqRepairList = (data) => requests({ url: '/shbx/search', method: 'post', data})

// 改变按钮开关状态
export const reqChangeSwitch = (data) => requests({ url: '/shbx/onoff', method: 'post', data})

// 添加报修信息
export const reqAddRepair = (data) => requests({ url: '/shbx/add', method: 'post', data })

// 删除报修信息
export const reqDeleteRepair = (data) => requests({ url: '/shbx/del', method: 'post', data})

// 查询宿舍评分数据
export const reqDormScoreList = (data) => requests({ url: '/sspf/search', method: 'post', data})

// 查询报修统计数据
export const reqRepairStatistics = (data) => requests({ url: '/bxtj/search', method: 'post', data })

// 添加报修统计数据
export const reqAddRepairStatistics = (data) => requests({ url: '/bxtj/add', method: 'post', data })

// 查询报修统计数据
export const reqBuildTube = (data) => requests({ url: '/lgpf/search', method: 'post', data })

// 添加报修统计数据
export const reqAddBuildTube = (data) => requests({ url: '/lgpf/add', method: 'post', data })