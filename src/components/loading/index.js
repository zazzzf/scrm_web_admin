//先引入loading组件
import LoadingOComponent from './loading'
const LoadingO = {}
LoadingO.install = function (Vue) {
// 生成一个Vue的子类 同时这个子类也就是组件
const LoadingOConstructor = Vue.extend(LoadingOComponent)
// 生成一个该子类的实例
const instance = new LoadingOConstructor()
// 将这个实例挂载在我创建的div上
// 并将此div加入全局挂载点内部
instance.$mount(document.createElement('div'))
document.body.appendChild(instance.$el)
//注入vue的原型链
Vue.prototype.$loadingO = {
    show() {
        instance.show = true
    },
    close(){  
        instance.show = false
        }
    }
}
export default LoadingO