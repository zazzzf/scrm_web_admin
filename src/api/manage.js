import request from '@/utils/request'
import qs from 'qs'

let setAuth = {};
setAuth.getPerMissionList = function(data){
  return request({
    url: 'manager/store/getPermission',
    method: 'Post',
    data: qs.stringify(data)
  })
}

setAuth.getlists = function(data){
    return request({
      url: 'manager/store/getlists',
      method: 'Post',
      data: qs.stringify(data)
    })
  }

  setAuth.setStorePermission = function(data){
    return request({
      url: 'manager/store/setStorePermission',
      method: 'Post',
      data: qs.stringify(data)
    })
  }

  setAuth.delUserGroup = function(data){
    return request({
      url: 'merchant/permission/delUserGroup',
      method: 'Post',
      data: qs.stringify(data)
    })
  }

  setAuth.addUserGroup = function(data){
    return request({
      url: 'merchant/permission/addUserGroup',
      method: 'Post',
      data: qs.stringify(data)
    })
  }
	
	setAuth.addStoreMainAccount = function(data){
	  return request({
	    url: 'manager/user/addStoreMainAccount',
	    method: 'Post',
	    data: qs.stringify(data)
	  })
	}
	
	setAuth.editstoremainaccount = function(data){
	  return request({
	    url: 'manager/user/editstoremainaccount',
	    method: 'Post',
	    data: qs.stringify(data)
	  })
	}
export default setAuth;