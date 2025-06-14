<template>
    <view class="container">
        <scroll-view class="sidebar" scroll-y>
            <view class="sidebar-title">💬 我的会话</view>

            <view v-for="item in conversations" :key="item.otherUserId" class="sidebar-item" @click="goToChat(item)">
                <view class="avatar">
                    {{ item.otherUsername?.charAt(0).toUpperCase() }}
                </view>
                <view class="content">
                    <text class="username">{{ item.otherUsername }}</text>
                    <text class="last-message">{{ item.lastMessageContent || '暂无消息' }}</text>
                </view>
            </view>
        </scroll-view>
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

    const conversations = ref([])
    const PAGE_SIZE = 200

    const fetchConversations = async () => {
        const res = await request({
            url: '/messages/conversations',
            method: 'GET',
            data: {
                pageNum: 1,
                pageSize: PAGE_SIZE,
            },
        })
        console.log(res)
        if (res.code === 600) {
            setTimeout(() => {
                uni.reLaunch({
                    url: '/pages/login/login'
                })
            }, 1000)
        }
        conversations.value = res.records || []
    }

    const goToChat = (item) => {
        uni.navigateTo({
            url: `/pages/chat/chat?userId=${item.otherUserId}&username=${encodeURIComponent(item.otherUsername)}`
        })
    }

    onMounted(() => {
        fetchConversations()
    })
</script>

<style scoped>
    .container {
        height: 100vh;
        background: linear-gradient(to bottom, #f0f4f8, #ffffff);
        padding: 20rpx;
    }

    .sidebar-title {
        font-size: 36rpx;
        font-weight: 700;
        color: #333;
        margin-bottom: 20rpx;
        padding-left: 10rpx;
    }

    .sidebar-item {
        display: flex;
        align-items: center;
        background-color: #ffffff;
        border-radius: 20rpx;
        padding: 24rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.05);
        transition: background 0.3s;
    }

    .sidebar-item:active {
        background-color: #e6f7ff;
    }

    .avatar {
        width: 80rpx;
        height: 80rpx;
        background: linear-gradient(to right, #4facfe, #00f2fe);
        color: #fff;
        font-weight: bold;
        font-size: 36rpx;
        text-align: center;
        line-height: 80rpx;
        border-radius: 50%;
        flex-shrink: 0;
        box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
    }

    .content {
        margin-left: 24rpx;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .username {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
    }

    .last-message {
        color: #888;
        font-size: 26rpx;
        line-height: 36rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>