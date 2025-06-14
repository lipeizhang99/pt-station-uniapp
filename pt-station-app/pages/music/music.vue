<template>
    <view class="container">
        <view class="music-info">
            <image :src="music.cover" mode="aspectFill" class="cover" />
            <text class="title">{{ music.title }}</text>
            <text class="artist">{{ music.artist }}</text>
        </view>

        <view class="controls">
            <button @click="togglePlay">
                {{ isPlaying ? '暂停' : '播放' }}
            </button>
            <text>{{ currentTimeStr }} / {{ durationStr }}</text>
        </view>

        <slider :value="progress" @changing="onSliderChanging" @change="onSliderChange" />
    </view>
</template>

<script setup>
    import {
        ref,
        onMounted,
        onUnmounted,
        computed
    } from 'vue'

    import {
        formatTime
    } from '../../utils/time';

    const music = {
        title: '夜曲',
        artist: '周杰伦',
        cover: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000003OUlho2HcRHC.jpg',
        url: 'https://webfs.yun.kugou.com/202306121939/063c0abf14d6d63722bafba607a4c601/KGTX/CLTX001/643674d6f0c140f55dbffbbaacee1c03.mp3'
    }

    const audio = uni.createInnerAudioContext()
    audio.src = music.url
    audio.autoplay = false

    const isPlaying = ref(false)
    const duration = ref(0)
    const currentTime = ref(0)

    const durationStr = computed(() => formatTime(duration.value))
    const currentTimeStr = computed(() => formatTime(currentTime.value))
    const progress = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)

    onMounted(() => {
        audio.onCanplay(() => {
            setTimeout(() => {
                duration.value = audio.duration
            }, 100)
        })

        audio.onTimeUpdate(() => {
            currentTime.value = audio.currentTime
        })

        audio.onEnded(() => {
            isPlaying.value = false
            currentTime.value = 0
        })
    })

    onUnmounted(() => {
        audio.destroy()
    })

    const togglePlay = () => {
        if (isPlaying.value) {
            audio.pause()
        } else {
            audio.play()
        }
        isPlaying.value = !isPlaying.value
    }

    const onSliderChanging = (e) => {
        currentTime.value = (e.detail.value / 100) * duration.value
    }

    const onSliderChange = (e) => {
        const newTime = (e.detail.value / 100) * duration.value
        audio.seek(newTime)
    }
</script>

<style scoped>
    .container {
        padding: 30rpx;
    }

    .music-info {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .cover {
        width: 300rpx;
        height: 300rpx;
        border-radius: 20rpx;
        margin-bottom: 20rpx;
    }

    .title {
        font-size: 32rpx;
        font-weight: bold;
    }

    .artist {
        font-size: 28rpx;
        color: #999;
    }

    .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 40rpx 0;
    }
</style>