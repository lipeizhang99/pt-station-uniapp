"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_time = require("../../utils/time.js");
const _sfc_main = {
  __name: "music",
  setup(__props) {
    const music = {
      title: "夜曲",
      artist: "周杰伦",
      cover: "https://y.gtimg.cn/music/photo_new/T002R300x300M000003OUlho2HcRHC.jpg",
      url: "https://webfs.yun.kugou.com/202306121939/063c0abf14d6d63722bafba607a4c601/KGTX/CLTX001/643674d6f0c140f55dbffbbaacee1c03.mp3"
    };
    const audio = common_vendor.index.createInnerAudioContext();
    audio.src = music.url;
    audio.autoplay = false;
    const isPlaying = common_vendor.ref(false);
    const duration = common_vendor.ref(0);
    const currentTime = common_vendor.ref(0);
    const durationStr = common_vendor.computed(() => utils_time.formatTime(duration.value));
    const currentTimeStr = common_vendor.computed(() => utils_time.formatTime(currentTime.value));
    const progress = common_vendor.computed(() => duration.value ? currentTime.value / duration.value * 100 : 0);
    common_vendor.onMounted(() => {
      audio.onCanplay(() => {
        setTimeout(() => {
          duration.value = audio.duration;
        }, 100);
      });
      audio.onTimeUpdate(() => {
        currentTime.value = audio.currentTime;
      });
      audio.onEnded(() => {
        isPlaying.value = false;
        currentTime.value = 0;
      });
    });
    common_vendor.onUnmounted(() => {
      audio.destroy();
    });
    const togglePlay = () => {
      if (isPlaying.value) {
        audio.pause();
      } else {
        audio.play();
      }
      isPlaying.value = !isPlaying.value;
    };
    const onSliderChanging = (e) => {
      currentTime.value = e.detail.value / 100 * duration.value;
    };
    const onSliderChange = (e) => {
      const newTime = e.detail.value / 100 * duration.value;
      audio.seek(newTime);
    };
    return (_ctx, _cache) => {
      return {
        a: music.cover,
        b: common_vendor.t(music.title),
        c: common_vendor.t(music.artist),
        d: common_vendor.t(isPlaying.value ? "暂停" : "播放"),
        e: common_vendor.o(togglePlay),
        f: common_vendor.t(currentTimeStr.value),
        g: common_vendor.t(durationStr.value),
        h: progress.value,
        i: common_vendor.o(onSliderChanging),
        j: common_vendor.o(onSliderChange)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c9f7182c"]]);
wx.createPage(MiniProgramPage);
