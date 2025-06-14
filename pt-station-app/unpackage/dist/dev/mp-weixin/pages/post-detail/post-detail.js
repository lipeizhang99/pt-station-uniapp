"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "post-detail",
  setup(__props) {
    const post = common_vendor.ref(null);
    const id = common_vendor.ref("");
    const likeCount = common_vendor.ref(0);
    const liked = common_vendor.ref(false);
    const commentText = common_vendor.ref("");
    const commentList = common_vendor.ref([]);
    const userName = common_vendor.index.getStorageSync("userName") || "";
    const isAdmin = common_vendor.index.getStorageSync("role") === "ADMIN";
    const renderedMarkdown = common_vendor.ref("");
    const fetchPostDetail = async () => {
      console.log(id.value);
      try {
        const res = await utils_request.request({
          url: `/forum2/posts/${id.value}`,
          method: "GET"
        });
        if (res) {
          post.value = res;
          likeCount.value = res.likeCount || 0;
          liked.value = res.isLiked || false;
          renderedMarkdown.value = common_vendor.marked.parse(res.content || "");
        }
      } catch (err) {
        common_vendor.index.showToast({
          icon: "none",
          title: "加载帖子失败"
        });
      }
    };
    const fetchComments = async () => {
      try {
        const res = await utils_request.request({
          url: `/forum2/posts/${id.value}/comments`,
          method: "GET",
          data: {
            pageNum: 1,
            pageSize: 100
          }
        });
        commentList.value = (res == null ? void 0 : res.records) || [];
      } catch (err) {
        common_vendor.index.showToast({
          icon: "none",
          title: "加载评论失败"
        });
      }
    };
    const handleLike = async () => {
      if (liked.value) {
        common_vendor.index.showToast({
          icon: "none",
          title: "你已经点过赞了"
        });
        return;
      }
      try {
        await utils_request.request({
          url: `/forum2/posts/${id.value}/like`,
          method: "POST"
        });
        likeCount.value++;
        liked.value = true;
      } catch {
        common_vendor.index.showToast({
          icon: "none",
          title: "点赞失败"
        });
      }
    };
    const handleComment = async () => {
      if (!commentText.value.trim()) {
        common_vendor.index.showToast({
          icon: "none",
          title: "评论不能为空"
        });
        return;
      }
      try {
        await utils_request.request({
          url: `/forum2/posts/${id.value}/comments`,
          method: "POST",
          data: {
            content: commentText.value
          }
        });
        commentText.value = "";
        await fetchComments();
        common_vendor.index.showToast({
          icon: "success",
          title: "评论成功"
        });
      } catch {
        common_vendor.index.showToast({
          icon: "none",
          title: "评论失败"
        });
      }
    };
    const handleDeleteComment = async (item) => {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这条评论吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_request.request({
                url: `/forum2/comments/${item.commentId}`,
                method: "DELETE"
              });
              common_vendor.index.showToast({
                icon: "success",
                title: "删除成功"
              });
              await fetchComments();
            } catch {
              common_vendor.index.showToast({
                icon: "none",
                title: "删除失败"
              });
            }
          }
        }
      });
    };
    const formatTime = (t) => common_vendor.dayjs(t).format("YYYY-MM-DD HH:mm:ss");
    common_vendor.onLoad((query) => {
      id.value = query.id;
      fetchPostDetail();
      fetchComments();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: post.value
      }, post.value ? {
        b: common_vendor.t(post.value.title),
        c: common_vendor.t(post.value.username),
        d: common_vendor.t(formatTime(post.value.createdAt)),
        e: common_vendor.t(post.value.viewCount),
        f: common_vendor.t(likeCount.value),
        g: renderedMarkdown.value,
        h: common_vendor.t(likeCount.value),
        i: common_vendor.n(liked.value ? "liked" : ""),
        j: common_vendor.o(handleLike),
        k: commentText.value,
        l: common_vendor.o(($event) => commentText.value = $event.detail.value),
        m: common_vendor.o(handleComment),
        n: common_vendor.f(commentList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.username === common_vendor.unref(userName) ? "你" : item.username),
            b: common_vendor.t(formatTime(item.createdAt)),
            c: common_vendor.t(item.content),
            d: isAdmin || item.username === common_vendor.unref(userName)
          }, isAdmin || item.username === common_vendor.unref(userName) ? {
            e: common_vendor.o(($event) => handleDeleteComment(item), item.commentId)
          } : {}, {
            f: item.commentId
          });
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-13500661"]]);
wx.createPage(MiniProgramPage);
