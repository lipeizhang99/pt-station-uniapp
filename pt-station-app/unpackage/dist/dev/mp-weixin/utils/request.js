"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://172.20.10.6:8080";
function request({
  url,
  method = "GET",
  data = {},
  params = {},
  // 👈 新增 params 支持
  header = {}
}) {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("token");
    if (method.toUpperCase() === "GET" && Object.keys(params).length > 0) {
      const queryString = Object.entries(params).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join("&");
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
    common_vendor.index.request({
      url: BASE_URL + url,
      method,
      data: method.toUpperCase() === "GET" ? void 0 : data,
      // GET 不发 data
      header: {
        "Content-Type": "application/json",
        Authorization: token || "",
        ...header
      },
      timeout: 5e3,
      success: (res) => {
        const code = res.data.code;
        if (code !== 200) {
          common_vendor.index.showToast({
            title: res.data.message || "请求失败",
            icon: "none"
          });
          if (code === 401 || code === 600) {
            common_vendor.index.showToast({
              title: "请重新登录",
              icon: "none"
            });
            common_vendor.index.removeStorageSync("token");
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/login/login"
              });
            }, 1e3);
          }
          reject(res.data.message || "请求失败");
        } else {
          resolve(res.data.data);
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({
          title: "网络错误，请稍后再试",
          icon: "none"
        });
        reject(err);
      }
    });
  });
}
exports.request = request;
