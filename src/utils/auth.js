import Cookies from 'js-cookie'

const TokenKey = 'SCS_PLATE_TOKEN'
// SCS_PLATE_TOKEN
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {expires: 7})
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRole(){
  const userinfo = Cookies.get("userinfo")
  if(userinfo){
    return JSON.parse(userinfo).role
  }else{
    return ""
  }
}