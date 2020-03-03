import request from '@/utils/request'
import qs from 'qs'

 export function internalList(data){
	return request({
		url: 'manager/Report/lists',
		method: 'post',
		data: qs.stringify(data)
	})
 }

 export function addInternal(data){
	return request({
		url: 'manager/Report/add',
		method: 'post',
		data: qs.stringify(data)
	})
 }

