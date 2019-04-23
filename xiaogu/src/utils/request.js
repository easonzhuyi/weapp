import Taro from '@tarojs/taro'
import {userApi, loginApi} from './api'

const STATUS_OK = 'OK'
const CODE_AUTH_EXPIRED = '600'

function getStorage(key) {
  return Taro
    .getStorage({key})
    .then(res => res.data)
    .catch(() => '')
}

function updateStorage(data = {}) {
  console.log('updateStorage', data)
  return Promise.all([
    Taro.setStorage({
      key: 'token',
      data: data['token'] || ''
    }),
    Taro.setStorage({
      key: 'uid',
      data: data['uid'] || ''
    })
  ])
}

/**
 * 简易封装网络请求
 * // NOTE 需要注意 RN 不支持 *StorageSync，此处用 async/await 解决
 * @param {*} options
 */
export default async function fetch(options) {
  const {
    url,
    payload,
    method = 'GET',
    showToast = true,
    autoLogin = true
  } = options
  const token = await getStorage('token')
  const header = token
    ? {
      'token': token
    }
    : {}
  if (method === 'POST') {
    header['content-type'] = 'application/json'
  }

  return Taro
    .request({url, method, data: payload, header})
    .then(async(res) => {
      const {code, data, status} = res.data
      if (status !== STATUS_OK) {
        // sk过期态
        if (code === CODE_AUTH_EXPIRED) {
          // 持久化?
          await updateStorage({})
        }
        return Promise.reject(res.data)
      }

      if (url === loginApi) {
        await updateStorage(data)
      }

      // XXX 用户信息需展示 uid，但是 uid 是登录接口就返回的，比较蛋疼，暂时糅合在 fetch 中解决
      if (url === userApi) {
        const uid = await getStorage('uid')
        return {
          ...data,
          uid
        }
      }

      return data
    })
    .catch((err) => {
      console.log(err, 123)
      const defaultMsg = err.code === CODE_AUTH_EXPIRED
        ? '登录失效'
        : '请求异常'
      if (showToast) {
        Taro.showToast({
          title: err && err.errorMsg || defaultMsg,
          icon: 'none'
        })
      }

      if (err.code === CODE_AUTH_EXPIRED && autoLogin) {
        Taro.navigateTo({url: '/pages/index/index'})
      }

      return Promise.reject({
        message: defaultMsg,
        ...err
      })
    })
}
