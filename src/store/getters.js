const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  tagList: state => state.user.tagList,
  categoryList: state => state.user.categoryList,
  userRole: state => state.user.userRole,
  addRouters: state => state.permission.addRouters
}
export default getters
