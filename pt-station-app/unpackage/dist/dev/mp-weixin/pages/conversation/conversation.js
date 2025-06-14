"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const PAGE_SIZE = 200;
const _sfc_main = {
  __name: "conversation",
  setup(__props) {
    const conversations = common_vendor.ref([]);
    const fetchConversations = async () => {
      const res = await utils_request.request({
        url: "/messages/conversations",
        method: "GET",
        data: {
          pageNum: 1,
          pageSize: PAGE_SIZE
        }
      });
      console.log(res);
      if (res.code === 600) {
        setTimeout(() => {
          common_vendor.index.reLaunch({
            url: "/pages/login/login"
          });
        }, 1e3);
      }
      conversations.value = res.records || [];
    };
    const goToChat = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?userId=${item.otherUserId}&username=${encodeURIComponent(item.otherUsername)}`
      });
    };
    common_vendor.onMounted(() => {
      fetchConversations();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(conversations.value, (item, k0, i0) => {
          var _a;
          return {
            a: common_vendor.t((_a = item.otherUsername) == null ? void 0 : _a.charAt(0).toUpperCase()),
            b: common_vendor.t(item.otherUsername),
            c: common_vendor.t(item.lastMessageContent || "暂无消息"),
            d: item.otherUserId,
            e: common_vendor.o(($event) => goToChat(item), item.otherUserId)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e1536a1d"]]);
wx.createPage(MiniProgramPage);
