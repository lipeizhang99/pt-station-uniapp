<template>
    <view class="container">
        <view class="header">
            <image :src="avatarUrl" class="avatar" />
            <view class="user-info">
                <view class="username">{{ user.username }}</view>
                <view class="tag">{{ user.role }}</view>
            </view>
        </view>

        <view class="section">
            <view class="label">等级：</view>
            <view class="value">{{ user.level }}</view>
        </view>
        <view class="section">
            <view class="label">积分：</view>
            <view class="value">{{ user.credit }}</view>
        </view>
        <view class="section">
            <view class="label">状态：</view>
            <view class="value">{{ user.status }}</view>
        </view>
        <view class="section">
            <view class="label">上传总量：</view>
            <view class="value">{{ uploadTotal }} MB</view>
        </view>
        <view class="section">
            <view class="label">下载总量：</view>
            <view class="value">{{ downloadTotal }} MB</view>
        </view>
        <view class="section">
            <view class="label">分享率：</view>
            <view class="value">{{ shareRatio }}</view>
        </view>
        <view class="section">
            <view class="label">剩余下载次数：</view>
            <view class="value">{{ remainingDownloadCount }}</view>
        </view>
        <view class="section">
            <view class="label">连接状态：</view>
            <view class="value">{{ connectionStatus }}</view>
        </view>

        <view class="actions">
            <button @click="logout" type="warn">退出登录</button>
        </view>
    </view>
</template>

<script setup>
    import {
        ref,
        onMounted
    } from 'vue'
    import {
        request
    } from '@/utils/request.js'

    const user = ref({})
    const shareRatio = ref(0)
    const uploadTotal = ref(0)
    const downloadTotal = ref(0)
    const remainingDownloadCount = ref(0)
    const connectionStatus = ref('未连接')

    const avatarUrl = ref('')

    function bytesToMB(bytes) {
        return (bytes / (1024 * 1024)).toFixed(2)
    }

    const fetchUser = async () => {
        const res1 = await request({
            url: '/users/info',
            method: 'GET'
        })
        user.value = res1
        avatarUrl.value = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${res1.username}`

        const res2 = await request({
            url: '/users/my-rewarded-ratio',
            method: 'GET'
        })
        shareRatio.value = res2.shareRatio
        uploadTotal.value = bytesToMB(res2.uploadTotal)
        downloadTotal.value = bytesToMB(res2.downloadTotal)

        const res3 = await request({
            url: '/users/downloads/remaining',
            method: 'GET'
        })
        remainingDownloadCount.value = res3

        const res4 = await request({
            url: '/users/my-status',
            method: 'GET'
        })
        connectionStatus.value = res4 ? '已连接' : '未连接'
    }

    const logout = () => {
        uni.removeStorageSync('token')
        setTimeout(() => {
            uni.reLaunch({
                url: '/pages/login/login'
            })
        }, 1000)
    }

    onMounted(() => {
        fetchUser()
    })
</script>

<style scoped>
    .container {
        padding: 30rpx;
    }

    .header {
        display: flex;
        align-items: center;
        margin-bottom: 40rpx;
    }

    .avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background-color: #eee;
    }

    .user-info {
        margin-left: 30rpx;
    }

    .username {
        font-size: 36rpx;
        font-weight: bold;
    }

    .tag {
        margin-top: 10rpx;
        background-color: #4a90e2;
        color: #fff;
        font-size: 24rpx;
        padding: 4rpx 12rpx;
        border-radius: 6rpx;
        display: inline-block;
    }

    .section {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20rpx;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 10rpx;
    }

    .label {
        color: #888;
    }

    .value {
        font-weight: bold;
    }

    .actions {
        margin-top: 40rpx;
        text-align: center;
    }
</style>