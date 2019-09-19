import request from '@/utils/request'
import qs from 'qs'

let snsApi = {};
snsApi.addKnowledge = function(data) {
	return request({
		url: 'manager/Knowledge/add',
		method: 'POST',
		data: qs.stringify(data),
	})
};
snsApi.getList = function(data) {
	return request({
		url: 'manager/Knowledge/getList',
		method: 'POST',
		data: qs.stringify(data),
	})
}

snsApi.delKnowledge = function(data) {
	return request({
		url: 'manager/Knowledge/del',
		method: 'POST',
		data: qs.stringify(data),
	})
}
snsApi.editKnowledge = function(data) {
	return request({
		url: 'manager/Knowledge/edit',
		method: 'POST',
		data: qs.stringify(data),
	})
}

snsApi.checkKnowledge = function(data) {
	return request({
		url: 'manager/knowledge/check',
		method: 'POST',
		data: qs.stringify(data),
	})
}

export default snsApi;
