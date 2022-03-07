import request from "../utils/request";

export const getGoodstotal = ()=>{
  return request({
    method:"GET",
    url:"/getGoodstotal"
  })
}

export const getAllRecord = (data: any) => {
  return request({
    method: "GET",
    url: "/getAllRecord",
    // data用来设置POST请求体
    
  })
};
export const getPermits = (data: any) => {
  return request({
    method: "GET",
    url: "/getPermit",
    // data用来设置POST请求体
    
  })
};
export const login = (data: any) => {
  return request({
    method: "POST",
    url: "/login",
    // data用来设置POST请求体
    data
  })
};
export const register = (data: any) => {
  return request({
    method: "POST",
    url: "/regist",
    // data用来设置POST请求体
    data
  })
};

export const logout = (uid: String) => {
  return request({
    method: "POST",
    url: "/logout",
    data: {
      id: uid
    }
  })
}
