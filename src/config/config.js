/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * apiUrl: 接口api地址
 * 
 */

let apiUrl = '';
let config = {};
let debug =  true;//是否测试模式
// console.log(process.env.NODE_ENV)
if (debug) {
    //测试
    apiUrl = '';
}else{
    //线上
    apiUrl = '';
}
config.API_URL = apiUrl;

config.ADMIN_LIST = ["xhl","koko","houlianjing","heci","nick","admin","diandian"];
/**
 * 七牛云
 */
config.QINIU_BASE_URL = ""                           //七牛上传地址
config.QINIU_URL_TYPE_IMG = ""               //七牛 图片地址
config.QINIU_URL_TYPE_VIDEO = ""             //七牛 视频地址
config.QINIU_URL_TYPE_KNOWLEDGE = ""     //智库地址 为加密存储库
config.QINIU_URL_TYPE_TIKTOK = ""     //抖音视频地址
config.QINIU_URL_TYPE_REPORT = ""           //报告地址

export default config
