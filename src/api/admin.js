import request from '@/utils/request'
import qs from 'qs'

let adminUser = {};
adminUser.userList = function(data) {
	return request({
		url: 'manager/user/userList',
		method: 'Post',
		data: qs.stringify(data)
	})
}

adminUser.addUser = function(data) {
	return request({
		url: 'manager/user/add',
		method: 'Post',
		data: qs.stringify(data)
	})
}
adminUser.delUser = function(data) {
	return request({
		url: 'manager/user/del',
		method: 'Post',
		data: qs.stringify(data)
	})
}
adminUser.editUser = function(data) {
	return request({
		url: 'manager/user/edit',
		method: 'Post',
		data: qs.stringify(data)
	})
}

export default adminUser;

/**
 * 分类管理接口
 */

export function categoryList(){
	return request({
		url: 'manager/category/categoryList',
		method: 'get',
	})
 }

 export function addcategory(data){
	return request({
		url: 'manager/category/add',
		method: 'post',
		data: qs.stringify(data)
	})
 }

 export function editcategory(data){
	return request({
		url: 'manager/category/edit',
		method: 'post',
		data: qs.stringify(data)
	})
 }

 export function delcategory(data){
	return request({
		url: 'manager/category/del',
		method: 'post',
		data: qs.stringify(data)
	})
 }