"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_time = require("../../utils/time.js");
const utils_request = require("../../utils/request.js");
const pageSize = 9;
const _sfc_main = {
  __name: "forum",
  setup(__props) {
    const tabs = ["图书", "交友", "软件", "音乐", "影视"];
    const sectionMap = {
      图书: "BOOK",
      交友: "SOCIAL",
      软件: "SOFTWARE",
      音乐: "MUSIC",
      影视: "MOVIE"
    };
    const activeTab = common_vendor.ref("图书");
    const posts = common_vendor.ref([]);
    const carouselPosts = common_vendor.ref([]);
    const pageNum = common_vendor.ref(1);
    const hasMore = common_vendor.ref(true);
    const loading = common_vendor.ref(false);
    const searchKeyword = common_vendor.ref("");
    const isSearching = common_vendor.ref(false);
    const notices = ["系统维护", "新功能上线", "论坛规则更新"];
    common_vendor.onMounted(() => {
      fetchCarousel();
      fetchPosts(true);
    });
    const changeTab = (tab) => {
      activeTab.value = tab;
      pageNum.value = 1;
      isSearching.value = false;
      fetchPosts(true);
    };
    const fetchCarousel = async () => {
      const res = await utils_request.request({
        url: "/forum2/posts/recommend",
        method: "GET"
      });
      const data = res.data || {};
      carouselPosts.value = Object.values(data);
    };
    const fetchPosts = async (reset = false) => {
      loading.value = true;
      const section = sectionMap[activeTab.value];
      const res = await utils_request.request({
        url: `/forum2/sections/${section}/posts`,
        method: "GET",
        data: {
          pageNum: reset ? 1 : pageNum.value,
          pageSize
        }
      });
      const records = (res == null ? void 0 : res.records) || [];
      const total = (res == null ? void 0 : res.total) || 0;
      if (reset) {
        posts.value = records;
        pageNum.value = 2;
      } else {
        posts.value = posts.value.concat(records);
        pageNum.value++;
      }
      hasMore.value = posts.value.length < total;
      loading.value = false;
    };
    const fetchSearchPosts = async (reset = false) => {
      loading.value = true;
      console.log(searchKeyword.value);
      const res = await utils_request.request({
        url: "/forum2/posts/search",
        method: "GET",
        params: {
          pageNum: reset ? 1 : pageNum.value,
          pageSize,
          keyword: searchKeyword.value.trim()
        }
      });
      console.log(res);
      const records = (res == null ? void 0 : res.records) || [];
      const total = (res == null ? void 0 : res.total) || 0;
      if (reset) {
        posts.value = records;
        pageNum.value = 2;
      } else {
        posts.value = posts.value.concat(records);
        pageNum.value++;
      }
      hasMore.value = posts.value.length < total;
      loading.value = false;
    };
    const onSearchClick = () => {
      if (searchKeyword.value.trim()) {
        isSearching.value = true;
        pageNum.value = 1;
        fetchSearchPosts(true);
      } else {
        isSearching.value = false;
        pageNum.value = 1;
        fetchPosts(true);
      }
    };
    const goPostDetail = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/post-detail/post-detail?id=${id}`
      });
    };
    common_vendor.onReachBottom(() => {
      if (loading.value || !hasMore.value)
        return;
      isSearching.value ? fetchSearchPosts() : fetchPosts();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(tabs, (tab, k0, i0) => {
          return {
            a: common_vendor.t(tab),
            b: tab,
            c: common_vendor.n(activeTab.value === tab ? "active" : ""),
            d: common_vendor.o(($event) => changeTab(tab), tab)
          };
        }),
        b: searchKeyword.value,
        c: common_vendor.o(($event) => searchKeyword.value = $event.detail.value),
        d: common_vendor.o(onSearchClick),
        e: common_vendor.f(notices, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item
          };
        }),
        f: common_vendor.f(posts.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.username),
            c: common_vendor.t(common_vendor.unref(utils_time.formatTime)(item.createdAt)),
            d: item.postId,
            e: common_vendor.o(($event) => goPostDetail(item.postId), item.postId)
          };
        }),
        g: loading.value
      }, loading.value ? {} : !hasMore.value ? {} : {}, {
        h: !hasMore.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-aeadbf01"]]);
wx.createPage(MiniProgramPage);
