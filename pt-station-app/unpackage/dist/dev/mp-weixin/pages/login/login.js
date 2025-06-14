"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const username = common_vendor.ref("");
    const password = common_vendor.ref("");
    const handleLogin = async () => {
      if (!username.value || !password.value) {
        return common_vendor.index.showToast({
          title: "请输入账号和密码",
          icon: "none"
        });
      }
      try {
        const res = await utils_request.request({
          url: "/users/login",
          method: "POST",
          data: {
            username: username.value,
            password: password.value
          }
        });
        if (res) {
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
          common_vendor.index.setStorageSync("token", res.token);
          common_vendor.index.setStorageSync("role", res.role);
          common_vendor.index.switchTab({
            url: "/pages/forum/forum"
          });
        } else {
          common_vendor.index.showToast({
            title: res.message || "登录失败",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.showToast({
          title: "请求失败，请检查网络",
          icon: "none"
        });
      }
    };
    const poems = [
      "欢迎来到PT站",
      "这里是免费开源的种子下载平台",
      "愿你常来常往，不负热爱"
    ];
    const currentIndex = common_vendor.ref(0);
    const fullText = common_vendor.ref(poems[0]);
    const displayedText = common_vendor.ref("");
    const typeNextCharacter = () => {
      if (displayedText.value.length < fullText.value.length) {
        displayedText.value += fullText.value[displayedText.value.length];
        setTimeout(typeNextCharacter, 100);
      } else {
        setTimeout(() => {
          currentIndex.value = (currentIndex.value + 1) % poems.length;
          fullText.value = poems[currentIndex.value];
          displayedText.value = "";
          typeNextCharacter();
        }, 2e3);
      }
    };
    common_vendor.onMounted(() => {
      typeNextCharacter();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(displayedText.value),
        b: username.value,
        c: common_vendor.o(($event) => username.value = $event.detail.value),
        d: password.value,
        e: common_vendor.o(($event) => password.value = $event.detail.value),
        f: common_vendor.o(handleLogin)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
