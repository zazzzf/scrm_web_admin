import request from '@/utils/request'
import qs from 'qs'

export function logon(data) {
  return request({
    url: 'manager/logon/logon',
    method: 'POST',
    data: qs.stringify(data)
  })
}

  export function changepassword (data){
    return request({
      url: 'manager/user/changepassword',
      method: 'POST',
      data: qs.stringify(data)
    })
  }