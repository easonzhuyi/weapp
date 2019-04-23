export const prefix = 'http://192.168.25.86/app/wechat'
// params code, encryptedData, iv
export const loginApi = `${prefix}/getPhoneNumber`
export const userApi = `${prefix}/getUser`
const setting = 'appsettinginfo/querySettingByType'
export const enteranceApi = `${prefix}/${setting}/1`