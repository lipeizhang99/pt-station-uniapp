<template>
    <view class="container">
        <!-- 打字机文本 -->
        <view class="typewriter">{{ displayedText }}</view>

        <view class="title">用户登录</view>

        <input class="input" type="text" placeholder="请输入用户名" v-model="username" />

        <input class="input" type="password" placeholder="请输入密码" v-model="password" />

        <button class="login-btn" @click="handleLogin">登录</button>
    </view>
</template>

<script setup>
    import {
        ref,
        watch,
        onMounted
    } from 'vue'
    import {
        request
    } from '@/utils/request'

    const username = ref('')
    const password = ref('')

    // 登录逻辑
    const handleLogin = async () => {
        if (!username.value || !password.value) {
            return uni.showToast({
                title: '请输入账号和密码',
                icon: 'none'
            })
        }

        try {
            const res = await request({
                url: '/users/login',
                method: 'POST',
                data: {
                    username: username.value,
                    password: password.value
                }
            })

            if (res) {
                uni.showToast({
                    title: '登录成功',
                    icon: 'success'
                })

                uni.setStorageSync('token', res.token)
                uni.setStorageSync('role', res.role)

                uni.switchTab({
                    url: '/pages/forum/forum'
                })
            } else {
                uni.showToast({
                    title: res.message || '登录失败',
                    icon: 'none'
                })
            }
        } catch (err) {
            uni.showToast({
                title: '请求失败，请检查网络',
                icon: 'none'
            })
        }
    }

    const poems = [
        '欢迎来到PT站',
        '这里是免费开源的种子下载平台',
        '愿你常来常往，不负热爱'
    ]

    const currentIndex = ref(0)
    const fullText = ref(poems[0])
    const displayedText = ref('')
    let typingTimer = null
    let switchLineTimer = null

    const typeNextCharacter = () => {
        if (displayedText.value.length < fullText.value.length) {
            displayedText.value += fullText.value[displayedText.value.length]
            typingTimer = setTimeout(typeNextCharacter, 100)
        } else {
            // 一行打完，2秒后切换下一行
            switchLineTimer = setTimeout(() => {
                currentIndex.value = (currentIndex.value + 1) % poems.length
                fullText.value = poems[currentIndex.value]
                displayedText.value = ''
                typeNextCharacter()
            }, 2000)
        }
    }

    onMounted(() => {
        typeNextCharacter()
    })
</script>

<style scoped>
    .container {
        padding: 100rpx 40rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .typewriter {
        font-size: 30rpx;
        color: #666;
        margin-bottom: 40rpx;
        height: 40rpx;
        white-space: nowrap;
        overflow: hidden;
        border-right: 2rpx solid #aaa;
        animation: blink 0.7s infinite step-end;
    }

    @keyframes blink {

        0%,
        100% {
            border-color: transparent;
        }

        50% {
            border-color: #aaa;
        }
    }

    .title {
        font-size: 40rpx;
        font-weight: bold;
        margin-bottom: 60rpx;
    }

    .input {
        width: 100%;
        height: 90rpx;
        margin-bottom: 40rpx;
        border: 1px solid #ddd;
        border-radius: 10rpx;
        padding: 0 20rpx;
        font-size: 32rpx;
        background-color: #fff;
    }

    .login-btn {
        width: 100%;
        height: 90rpx;
        background-color: #007aff;
        color: #fff;
        font-size: 34rpx;
        border-radius: 10rpx;
        border: none;
    }
</style>