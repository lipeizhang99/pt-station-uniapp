"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "user",
  setup(__props) {
    const user = common_vendor.ref({});
    const shareRatio = common_vendor.ref(0);
    const uploadTotal = common_vendor.ref(0);
    const downloadTotal = common_vendor.ref(0);
    const remainingDownloadCount = common_vendor.ref(0);
    const connectionStatus = common_vendor.ref("未连接");
    const avatarUrl = common_vendor.ref("");
    function bytesToMB(bytes) {
      return (bytes / (1024 * 1024)).toFixed(2);
    }
    const fetchUser = async () => {
      const res1 = await utils_request.request({
        url: "/users/info",
        method: "GET"
      });
      user.value = res1;
      avatarUrl.value = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${res1.username}`;
      const res2 = await utils_request.request({
        url: "/users/my-rewarded-ratio",
        method: "GET"
      });
      shareRatio.value = res2.shareRatio;
      uploadTotal.value = bytesToMB(res2.uploadTotal);
      downloadTotal.value = bytesToMB(res2.downloadTotal);
      const res3 = await utils_request.request({
        url: "/users/downloads/remaining",
        method: "GET"
      });
      remainingDownloadCount.value = res3;
      const res4 = await utils_request.request({
        url: "/users/my-status",
        method: "GET"
      });
      connectionStatus.value = res4 ? "已连接" : "未连接";
    };
    const logout = () => {
      common_vendor.index.removeStorageSync("token");
      setTimeout(() => {
        common_vendor.index.reLaunch({
          url: "/pages/login/login"
        });
      }, 1e3);
    };
    common_vendor.onMounted(() => {
      fetchUser();
    });
    return (_ctx, _cache) => {
      return {
        a: avatarUrl.value,
        b: common_vendor.t(user.value.username),
        c: common_vendor.t(user.value.role),
        d: common_vendor.t(user.value.level),
        e: common_vendor.t(user.value.credit),
        f: common_vendor.t(user.value.status),
        g: common_vendor.t(uploadTotal.value),
        h: common_vendor.t(downloadTotal.value),
        i: common_vendor.t(shareRatio.value),
        j: common_vendor.t(remainingDownloadCount.value),
        k: common_vendor.t(connectionStatus.value),
        l: common_vendor.o(logout)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f7520f0"]]);
wx.createPage(MiniProgramPage);
