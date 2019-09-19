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
