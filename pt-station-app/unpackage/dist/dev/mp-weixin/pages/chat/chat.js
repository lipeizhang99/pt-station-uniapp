"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const PAGE_SIZE = 200;
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const selectedUserId = common_vendor.ref(null);
    const selectedUsername = common_vendor.ref("");
    const inputContent = common_vendor.ref("");
    const messages = common_vendor.ref([]);
    const pollingInterval = common_vendor.ref(null);
    const fetchMessages = async () => {
      if (!selectedUserId.value)
        return;
      const res = await utils_request.request({
        url: `/messages/conversation/${selectedUserId.value}`,
        method: "GET",
        data: {
          pageNum: 1,
          pageSize: PAGE_SIZE
        }
      });
      messages.value = res.records || [];
    };
    const sendMessage = async () => {
      if (!selectedUserId.value || !inputContent.value.trim())
        return;
      await utils_request.request({
        url: "/messages",
        method: "POST",
        data: {
          receiverId: selectedUserId.value,
          content: inputContent.value.trim()
        }
      });
      inputContent.value = "";
      fetchMessages();
    };
    const formatTime = (timeStr) => {
      const date = new Date(timeStr);
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    };
    const startPolling = () => {
      pollingInterval.value = setInterval(() => {
        if (selectedUserId.value)
          fetchMessages();
      }, 3e3);
    };
    const stopPolling = () => {
      if (pollingInterval.value)
        clearInterval(pollingInterval.value);
    };
    common_vendor.onMounted(() => {
      startPolling();
    });
    common_vendor.onUnmounted(() => {
      stopPolling();
    });
    common_vendor.onLoad((query) => {
      selectedUserId.value = Number(query.userId);
      selectedUsername.value = query.username || "未知用户";
      fetchMessages();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(selectedUsername.value || "请选择会话"),
        b: messages.value.length === 0
      }, messages.value.length === 0 ? {} : {}, {
        c: common_vendor.f(messages.value, (msg, k0, i0) => {
          return {
            a: common_vendor.t(msg.content),
            b: common_vendor.t(formatTime(msg.createdAt)),
            c: msg.id,
            d: common_vendor.n(msg.senderId === selectedUserId.value ? "left" : "right")
          };
        }),
        d: !selectedUserId.value,
        e: inputContent.value,
        f: common_vendor.o(($event) => inputContent.value = $event.detail.value),
        g: common_vendor.o(sendMessage),
        h: !inputContent.value.trim()
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0a633310"]]);
wx.createPage(MiniProgramPage);
