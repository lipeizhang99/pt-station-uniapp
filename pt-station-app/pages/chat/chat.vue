<template>
    <view class="container">
        <!-- 顶部标题 -->
        <view class="chat-header">
            {{ selectedUsername || '请选择会话' }}
        </view>

        <!-- 消息列表 -->
        <scroll-view class="chat-messages" scroll-y>
            <view v-if="messages.length === 0" class="no-messages">📭 暂无消息</view>

            <view v-for="msg in messages" :key="msg.id"
                :class="['chat-message', msg.senderId === selectedUserId ? 'left' : 'right']">
                <view class="bubble">{{ msg.content }}</view>
                <view class="timestamp">{{ formatTime(msg.createdAt) }}</view>
            </view>
        </scroll-view>

        <!-- 输入栏 -->
        <view class="chat-input">
            <textarea v-model="inputContent" placeholder="请输入内容…" auto-height class="chat-textarea"
                :disabled="!selectedUserId" />
            <button @click="sendMessage" :disabled="!inputContent.trim()">发送</button>
        </view>
    </view>
</template>

<script setup>
    import {
        ref,
        onMounted,
        onUnmounted
    } from 'vue'
    import {
        onLoad
    } from '@dcloudio/uni-app'
    import {
        request
    } from '@/utils/request.js'

    const selectedUserId = ref(null)
    const selectedUsername = ref('')
    const inputContent = ref('')
    const messages = ref([])
    const pollingInterval = ref(null)

    const PAGE_SIZE = 200

    const fetchMessages = async () => {
        if (!selectedUserId.value) return
        const res = await request({
            url: `/messages/conversation/${selectedUserId.value}`,
            method: 'GET',
            data: {
                pageNum: 1,
                pageSize: PAGE_SIZE
            }
        })
        messages.value = res.records || []
    }

    const sendMessage = async () => {
        if (!selectedUserId.value || !inputContent.value.trim()) return
        await request({
            url: '/messages',
            method: 'POST',
            data: {
                receiverId: selectedUserId.value,
                content: inputContent.value.trim()
            }
        })
        inputContent.value = ''
        fetchMessages()
    }

    const formatTime = (timeStr) => {
        const date = new Date(timeStr)
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes()
    .toString()
    .padStart(2, '0')}`
    }

    const startPolling = () => {
        pollingInterval.value = setInterval(() => {
            if (selectedUserId.value) fetchMessages()
        }, 3000)
    }

    const stopPolling = () => {
        if (pollingInterval.value) clearInterval(pollingInterval.value)
    }

    onMounted(() => {
        startPolling()
    })

    onUnmounted(() => {
        stopPolling()
    })

    onLoad((query) => {
        selectedUserId.value = Number(query.userId)
        selectedUsername.value = query.username || '未知用户'
        fetchMessages()
    })
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: #f2f3f5;
    }

    .chat-header {
        background: #4a90e2;
        color: white;
        font-size: 34rpx;
        padding: 30rpx;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
    }

    .chat-messages {
        flex: 1;
        padding: 24rpx;
        overflow-y: scroll;
        background: #f2f3f5;
    }

    .no-messages {
        text-align: center;
        color: #999;
        margin-top: 100rpx;
        font-size: 28rpx;
    }

    .chat-message {
        display: flex;
        flex-direction: column;
        max-width: 95%;
        margin-bottom: 30rpx;
        word-break: break-word;
    }

    .chat-message.left {
        align-self: flex-start;
        align-items: flex-start;
    }

    .chat-message.right {
        align-self: flex-end;
        align-items: flex-end;
    }

    .bubble {
        padding: 20rpx 28rpx;
        border-radius: 28rpx;
        font-size: 28rpx;
        background: #ffffff;
        box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.06);
    }

    .chat-message.right .bubble {
        background: #4a90e2;
        color: white;
    }

    .timestamp {
        font-size: 20rpx;
        color: #aaa;
        margin-top: 10rpx;
    }

    .chat-input {
        display: flex;
        padding: 20rpx;
        border-top: 1px solid #ddd;
        background: #fff;
        align-items: center;
    }

    .chat-textarea {
        flex: 1;
        border: 1px solid #ccc;
        border-radius: 20rpx;
        padding: 16rpx 20rpx;
        font-size: 28rpx;
        background: #f9f9f9;
    }

    button {
        margin-left: 20rpx;
        padding: 16rpx 32rpx;
        background: #4a90e2;
        color: white;
        font-size: 28rpx;
        border: none;
        border-radius: 20rpx;
        transition: opacity 0.2s;
    }

    button:disabled {
        background: #ccc;
        opacity: 0.7;
    }
</style>