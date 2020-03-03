import request from '@/utils/request'


export function pendinghotvideo() {
	return request({
	  url: 'manager/dash_board/pendinghotvideo',
	  method: 'GET',
	})
}

export function storeIncrease() {
	return request({
	  url: 'manager/dash_board/storeIncrease',
	  method: 'GET',
	})
}
