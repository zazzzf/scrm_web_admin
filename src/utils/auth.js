import Cookies from 'js-cookie'

const TokenKey = 'SCRM_PLATE_TOKEN'
// SCRM_PLATE_TOKEN
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
