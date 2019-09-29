import request from '@/utils/request'
import qs from 'qs'

let scriptApi = {};
scriptApi.addScript = function(data) {
	return request({
		url: 'manager/script/add',
		method: 'POST',
		data: qs.stringify(data),
	})
};
scriptApi.getList = function(data) {
	return request({
		url: 'manager/script/getList',
		method: 'POST',
		data: qs.stringify(data),
	})
}

scriptApi.delScript = function(data) {
	return request({
		url: 'manager/script/del',
		method: 'POST',
		data: qs.stringify(data),
	})
}
scriptApi.editScript = function(data) {
	return request({
		url: 'manager/script/edit',
		method: 'POST',
		data: qs.stringify(data),
	})
}

scriptApi.checkScript = function(data) {
	return request({
		url: 'manager/script/checkscript',
		method: 'POST',
		data: qs.stringify(data),
	})
}

export default scriptApi;
