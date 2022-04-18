import Cookies from 'js-cookie'

import JSEncrypt from 'jsencrypt';
const TokenKey = 'accessToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


// rsa加密
export function encrypt(plainText, publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeZNLUR1VeKcFconLVkWV2Hkg9amwQ6oyKprnVOZ0AHpMKyolresMywOExULhKVDL2I4ptIAVptYtp8Skf6QupES8y1LuWmt/a0pm4VMRdRnP65PWv8AS00D8Aor8vb2oZ9UWQJv1FnDu7QIGusLVkZ8/Fpjll9yew13y0jCJKPwIDAQAB"
) {
  let encryptStr = new JSEncrypt();
  // 设置公钥
  encryptStr.setPublicKey(publicKey);
  // 加密
  return encryptStr.encrypt(plainText);
}

// rsa解密
export function decrypt(cypherText, privateKey) {
  let encryptStr = new JSEncrypt();
  // 设置私钥
  encryptStr.setPrivateKey(privateKey);
  // 加密
  return encryptStr.decrypt(cypherText);
}
