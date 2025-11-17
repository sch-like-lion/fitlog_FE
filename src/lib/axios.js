import axios from "axios";

/*
axios.defaults.baseURL = "https://jsonplaceholder.typicode.com" // baseURL 기본값
// axios.defaults.baseURL = "http://fitlog.iubns.net:8080"
axios.defaults.headers.post['Content-Type'] = 'application/json' // post 요청시 content-type설정기본값
// 인증/인가 필요한 API에 대해서 token값을 쿠키에 보낼지, localStorage에서 꺼내서 headers : Authorization에 보낼지 
이렇게 해놔도 아래에 반영안된다고 함
*/
const baseURL = "https://fitlog.iubns.net"
const normalAPI = axios.create({
  baseURL : baseURL,
  headers : {
    post : {
      'Content-Type' : 'application/json'
    }
  }
})

const cookieAPI = axios.create({
  // baseURL : "http://fitlog.iubns.net:8080",
  baseURL : baseURL,
  withCredentials : true,
  headers : {
    post : {
      'Content-Type' : 'application/json'
    }
  }
})

const localStorageAPI = axios.create({
  // baseURL : "http://fitlog.iubns.net:8080",
  baseURL : baseURL,
  headers : {
    post : {
      'Content-Type' : 'application/json'
    }
  }
})

localStorageAPI.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if(token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export { normalAPI, cookieAPI, localStorageAPI }