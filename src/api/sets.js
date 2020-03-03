import request from '@/utils/request'
import qs from 'qs'

let setsApi = {};
setsApi.list = function(data) {
	return request({
		url: 'manager/Knowledge/knowledgeSetList',
		method: 'POST',
		data: qs.stringify(data),
	})
};
setsApi.add = function(data) {
	return request({
		url: 'manager/knowledge/addKnowledgeSet',
		method: 'POST',
		data: qs.stringify(data),
	})
}

setsApi.edit = function(data) {
	return request({
		url: 'manager/Knowledge/editKnowledgeSet',
		method: 'POST',
		data: qs.stringify(data),
	})
}

setsApi.del = function(data) {
	return request({
		url: 'manager/Knowledge/delKnowledgeSet',
		method: 'POST',
		data: qs.stringify(data),
	})
}

setsApi.status = function(data) {
	return request({
		url: 'manager/Knowledge/changeKnowledgeSetStatus',
		method: 'POST',
		data: qs.stringify(data),
	})
}

export default setsApi;
