import request from '@/utils/request'
import qs from 'qs'

export function logon(data) {
  return request({
    url: 'manager/logon/logon',
    method: 'POST',
    data: qs.stringify(data)
  })
}

export function forgetPassword(data) {
    return request({
      url: 'merchant/user/forgetPassword',
      method: 'POST',
      data: qs.stringify(data)
    })
  }

  export function confirmEmail(data) {
    return request({
      url: 'merchant/user/checkemail',
      method: 'POST',
      data: qs.stringify(data)
    })
  }

  export function sendMail(data) {
    return request({
      url: 'merchant/user/sendMail',
      method: 'POST',
      data: qs.stringify(data)
    })
  }

  export function register(data) {
    return request({
      url: 'merchant/user/register',
      method: 'POST',
      data: qs.stringify(data)
    })
  }