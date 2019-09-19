import axios from 'axios';


let util = {

};
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
util.FormatDate = function (DateObj,fmt) { //author: meizz 
    if(!DateObj)return;
    var o = {
        "M+": DateObj.getMonth() + 1, //月份 
        "d+": DateObj.getDate(), //日 
        "h+": DateObj.getHours(), //小时 
        "m+": DateObj.getMinutes(), //分 
        "s+": DateObj.getSeconds(), //秒 
        "q+": Math.floor((DateObj.getMonth() + 3) / 3), //季度 
        "S": DateObj.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (DateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//对于timestamp 的扩展；将时间戳算出的 时间戳类型时间长度转换为 几天几小时几分；传入时间戳单位 毫秒；
util.formatTimes = function (timestamp){
    timestamp = timestamp*0.001;
    var day = Math.floor(timestamp / 86400);
    var hour = Math.floor(timestamp % 86400 / 3600);
    var minute = Math.floor(timestamp % 86400 % 3600 / 60);
    var s = Math.floor(timestamp % 86400 % 3600 % 60 / 60);
    return hour+":"+minute+":"+s;
  }
//获取月份 输出（2010-0101）
util.FormatMonth = function(time) {
    if(time.length<10){return time;}
    else{
        var year = time.getFullYear();
        var month = time.getMonth()+1;
        var newmonth;
        if(month<10){
            newmonth = "0" + month;
        }else{
            newmonth = month;
        }
        return year + "-" + newmonth;
    }
}
util.numberCarry = function (value,carryNumber,fixed) {
  if (!(value!="")) return '0';
  return ( value / carryNumber ).toFixed( fixed );
  
};

util.formatImageUrl = function (imageUrl) {
  if (!imageUrl) return '';
  return Config.public.qiniuUrl+imageUrl.replace(Config.public.qiniuUrl,"");
};

util.title = function (title) {
    var langeStor = localStorage.lange;
    if(!langeStor){langeStor = 'zh-CN'}
    // console.log(lange[localStorage.lange].page_title);
    title = title ||lange[langeStor].page_title;
    window.document.title = title;
};


util.inOf = function (arr, targetArr) {
    let res = true;
    arr.map(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.fmoney = function (s, n) { 
    n = n > 0 && n <= 20 ? n : 2; 
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + ""; 
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1]; 
    let t = ""; 
    for (let i = 0; i < l.length; i++) { 
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : ""); 
    } 
    return t.split("").reverse().join("") + "." + r; 
};

util.mixedRights = function (routerObj,rightObj) {
    $.each(routerObj, function(index, val) {
        if(val.mixedRights){
            if(Config.api[val.name]){
                if(val.children){
                  val.children.forEach(valChildren => {
                    if(Config.api[val.name][valChildren.name]){                        
                        $.each(Config.api[val.name][valChildren.name], function(ApiName, ApiPath) {
                            if(rightObj[ApiPath]){
                                val.access=1;
                                valChildren.access=1;
                                return;
                            }
                        })
                    }
                  })  
                }else{
                    $.each(Config.api[val.name], function(apiName, apiPath) {

                        if(rightObj[apiPath]){
                            val.access=1;
                            return;
                        }
                    });   
                };
            };
        };
        
    }); 
};

// util.mixedRights = function (object1,object2,contrast_key,mix_key,children_key) {
//     if(object1&&$.isArray(object1)&&object2&&$.isArray(object2)){
//         object1.forEach(item1 => {
//             object2.forEach((item2)=>{
//                 if(item2[contrast_key]==item1[contrast_key]){
//                     item1[mix_key]=item2[mix_key]
//                 };
//                 if(!!item1[children_key]&&!!item2[children_key]){
//                     util.mixedRights(item1[children_key],item2[children_key],contrast_key,mix_key,children_key);
//                 };
//             });
//         });
//     }else if(object1&&$.isPlainObject(object1)&&object2&&$.isPlainObject(object2)){
//         for (item1 in object1) {
//             for (item2 in object2) {
//                 if(item2[contrast_key]==item1[contrast_key]){
//                     item1[mix_key]=item2[mix_key]
//                 }; 
//             }
//         }
//     };
// };

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && itAccess.isArray()) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    let routerObj = {};

    routers.forEach(item => {
        if (item.name === 'otherRouter') {
            item.children.forEach((child, i) => {
                if (child.name === name) {
                    routerObj = item.children[i];
                }
            });
        } else {

            if (item.children.length === 1) {
                if (item.children[0].name === name) {
                    routerObj = item.children[0];
                }
            } else {
                item.children.forEach((child, i) => {
                    if (child.name === name) {
                        routerObj = item.children[i];
                    }
                });
            }
        }
    });
    return routerObj;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];

    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } 
    else 
    if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if(currentPathObj){
            if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
                currentPathArr = [
                    {
                        title: '首页',
                        path: '',
                        name: 'home_index'
                    }
                ];
            } 
            else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
                currentPathArr = [
                    {
                        title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.routers, 'home_index')),
                        path: '/home',
                        name: 'home_index'
                    },
                    {
                        title: currentPathObj.title,
                        path: '',
                        name: name
                    }
                ];
            } 
            else {
                let childObj = currentPathObj.children.filter((child) => {
                    return child.name === name;
                })[0];
                currentPathArr = [
                    {
                        title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.routers, 'home_index')),
                        path: '/home',
                        name: 'home_index'
                    },
                    {
                        title: currentPathObj.title,
                        path: '',
                        name: currentPathObj.name
                    },
                    {
                        title: childObj.title,
                        path: currentPathObj.path + '/' + childObj.path,
                        name: name
                    }
                ];
            }
        }else{
            vm.$router.push({
                name: 'home_index'
            });
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) {  // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });

        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.getQueryVariable = function(variable,query) {
    if(!query){
        var query = window.location.search.substring(1);
    };
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

export default util;
