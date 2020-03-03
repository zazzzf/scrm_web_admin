/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * apiUrl: 接口api地址
 * 
 */

let apiUrl = '';
let config = {};
let debug =  false;//是否测试模式
// console.log(process.env.NODE_ENV)
if (debug) {
    //测试
    apiUrl = 'http://scrm-api-dev.xaxhl.net/index.php?s=';
}else{
    //线上
    apiUrl = 'http://scrm-api.xaxhl.net/index.php?s=';
}
config.API_URL = apiUrl;

config.ADMIN_LIST = ["xhl","koko","houlianjing","heci","nick","admin","diandian"];
/**
 * 七牛云
 */
config.QINIU_BASE_URL = "http://up-z1.qiniup.com"                           //七牛上传地址
config.QINIU_URL_TYPE_IMG = "http://scrm-image-qn.xaxhl.net/"               //七牛 图片地址
config.QINIU_URL_TYPE_VIDEO = "http://scrm-video-qn.xaxhl.net/"             //七牛 视频地址
config.QINIU_URL_TYPE_KNOWLEDGE = "http://scrm-knowledge-qn.xaxhl.net/"     //智库地址 为加密存储库
config.QINIU_URL_TYPE_TIKTOK = "http://scrm-tiktok-video-qn.xaxhl.net/"     //抖音视频地址
config.QINIU_URL_TYPE_REPORT = "http://scrm-report-qn.xaxhl.net/"           //报告地址

export default config