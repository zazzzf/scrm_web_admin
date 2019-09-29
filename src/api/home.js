import request from '@/utils/request'


export function pendingChecKCase() {
	return request({
	  url: 'manager/dash_board/pendingChecKCase',
	  method: 'GET',
	})
}

export function pendingCheckScript() {
	return request({
	  url: 'manager/dash_board/pendingCheckScript',
	  method: 'GET',
	})
}

export function pendingCheckReport() {
	return request({
	  url: 'manager/dash_board/pendingCheckReport',
	  method: 'GET',
	})
}

export function storeIncrease() {
	return request({
	  url: 'manager/dash_board/storeIncrease',
	  method: 'GET',
	})
}
