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

/**
 * 集合管理
 */
export function GET_SETLIST(){
	return request({
		url: 'manager/knowledge/knowledgeSetList',
		method: 'GET',
	})
}

export function CHANGE_SET_STATUS(data){
	return request({
		url: 'manager/knowledge/changeKnowledgeSetStatus',
		method: 'post',
		data: qs.stringify(data),
	})
}

export function THE_SET_EDIT(data){
	return request({
		url: 'manager/knowledge/editKnowledgeSet',
		method: 'post',
		data: qs.stringify(data),
	})
}

export function THE_SET_ADD(data){
	return request({
		url: 'manager/knowledge/addKnowledgeSet',
		method: 'post',
		data: qs.stringify(data),
	})
}

export function THE_SET_DEL(data){
	return request({
		url: 'manager/knowledge/delKnowledgeSet',
		method: 'post',
		data: qs.stringify(data),
	})
}
/**
 * 热点速报
 */
export function getTodayTop(){
	return request({
		url: 'manager/knowledge/getTodayTop',
		method: 'GET',
	})
}

export function addknowledgedaily(data){
	return request({
		url: 'manager/knowledge/addknowledgedaily',
		method: 'post',
		data: qs.stringify(data),
	})
}

export function editknowledgedaily(data){
	return request({
		url: 'manager/knowledge/editknowledgedaily',
		method: 'post',
		data: qs.stringify(data),
	})
}

export function checkKnowledgeDailyStatus(data){
	return request({
		url: 'manager/knowledge/checkKnowledgeDailyStatus',
		method: 'post',
		data: qs.stringify(data),
	})
}

export function knowledgeDailyList(data){
	return request({
		url: 'manager/knowledge/knowledgeDailyList',
		method: 'post',
		data: qs.stringify(data),
	})
}