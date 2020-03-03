const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  tagList: state => state.user.tagList,
  categoryList: state => state.user.categoryList,
  userRole: state => state.user.userRole,
  addRouters: state => state.permission.addRouters
}
export default getters
