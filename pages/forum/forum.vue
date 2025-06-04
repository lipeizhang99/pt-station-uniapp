<template>
    <view class="container">
        <!-- 顶部模块切换 -->
        <view class="tab-bar">
            <view v-for="tab in tabs" :key="tab" :class="['tab-item', activeTab === tab ? 'active' : '']"
                @tap="changeTab(tab)">
                {{ tab }}
            </view>
        </view>


        <!-- 搜索与发帖 -->
        <view class="search-bar">
            <input class="input" v-model="searchKeyword" placeholder="搜索帖子..." />
            <button class="btn" @tap="onSearchClick">搜索</button>
        </view>

        <!-- 通知区域 -->
        <view class="notify">
            <view class="notify-title">📢 通知</view>
            <view class="notify-item" v-for="item in notices" :key="item">
                • {{ item }}
            </view>
        </view>

        <!-- 帖子列表 -->
        <view v-for="item in posts" :key="item.postId" class="post-card" @tap="goPostDetail(item.postId)">
            <view class="post-title">{{ item.title }}</view>
            <view class="post-meta">作者：{{ item.username }} | {{ formatTime(item.createdAt) }}</view>
        </view>

        <!-- 加载提示 -->
        <view class="load-status">
            <text v-if="loading">加载中...</text>
            <text v-else-if="!hasMore">没有更多帖子了</text>
        </view>
    </view>
</template>

<script setup>
    import {
        ref,
        onMounted
    } from 'vue'
    import {
        onReachBottom
    } from '@dcloudio/uni-app'
    import {
        formatTime
    } from '@/utils/time' // 自定义时间格式化工具
    import {
        request
    } from "@/utils/request.js";
    const tabs = ['图书', '交友', '软件', '音乐', '影视']
    const sectionMap = {
        图书: 'BOOK',
        交友: 'SOCIAL',
        软件: 'SOFTWARE',
        音乐: 'MUSIC',
        影视: 'MOVIE',
    }

    const activeTab = ref('图书')
    const posts = ref([])
    const carouselPosts = ref([])
    const pageNum = ref(1)
    const pageSize = 9
    const hasMore = ref(true)
    const loading = ref(false)
    const searchKeyword = ref('')
    const isSearching = ref(false)


    const notices = ['系统维护', '新功能上线', '论坛规则更新']

    onMounted(() => {
        fetchCarousel()
        fetchPosts(true)
    })

    const changeTab = (tab) => {
        activeTab.value = tab
        pageNum.value = 1
        isSearching.value = false
        fetchPosts(true)
    }

    const fetchCarousel = async () => {
        const res = await request({
            url: '/forum2/posts/recommend',
            method: 'GET'
        });
        const data = res.data || {}
        carouselPosts.value = Object.values(data)
    }



    const fetchPosts = async (reset = false) => {
        loading.value = true
        const section = sectionMap[activeTab.value]
        const res = await request({
            url: `/forum2/sections/${section}/posts`,
            method: 'GET',
            data: {
                pageNum: reset ? 1 : pageNum.value,
                pageSize
            }
        });


        const records = res?.records || []
        const total = res?.total || 0

        if (reset) {
            posts.value = records
            pageNum.value = 2
        } else {
            posts.value = posts.value.concat(records)
            pageNum.value++
        }

        hasMore.value = posts.value.length < total
        loading.value = false
    }

    const fetchSearchPosts = async (reset = false) => {
        loading.value = true
        console.log(searchKeyword.value)
        const res = await request({
            url: '/forum2/posts/search',
            method: 'GET',
            params: {
                pageNum: reset ? 1 : pageNum.value,
                pageSize,
                keyword: searchKeyword.value.trim(),
            },
        })
        console.log(res)


        const records = res?.records || []
        const total = res?.total || 0

        if (reset) {
            posts.value = records
            pageNum.value = 2
        } else {
            posts.value = posts.value.concat(records)
            pageNum.value++
        }

        hasMore.value = posts.value.length < total
        loading.value = false
    }

    const onSearchClick = () => {
        if (searchKeyword.value.trim()) {
            isSearching.value = true
            pageNum.value = 1
            fetchSearchPosts(true)
        } else {
            isSearching.value = false
            pageNum.value = 1
            fetchPosts(true)
        }
    }

    const goPostDetail = (id) => {
        uni.navigateTo({
            url: `/pages/post-detail/post-detail?id=${id}`,
        })
    }

    const goToPost = () => {
        uni.navigateTo({
            url: '/pages/forum/post',
        })
    }

    onReachBottom(() => {
        if (loading.value || !hasMore.value) return
        isSearching.value ? fetchSearchPosts() : fetchPosts()
    })
</script>

<style scoped>
    .container {
        padding: 20rpx;
    }

    .tab-bar {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20rpx;
    }

    .tab-item {
        padding: 10rpx 20rpx;
        color: #666;
        border-bottom: 4rpx solid transparent;
    }

    .tab-item.active {
        color: #1afa29;
        border-color: #1afa29;
    }

    .carousel {
        height: 300rpx;
        margin-bottom: 20rpx;
    }

    .carousel-img {
        width: 100%;
        height: 100%;
        border-radius: 12rpx;
    }

    .carousel-title {
        position: absolute;
        bottom: 20rpx;
        left: 20rpx;
        background: rgba(0, 0, 0, 0.5);
        padding: 10rpx;
        border-radius: 8rpx;
        color: #fff;
    }



    .notify {
        background: #f4f4f4;
        padding: 20rpx;
        border-radius: 10rpx;
        margin-bottom: 20rpx;
    }

    .notify-title {
        font-weight: bold;
        margin-bottom: 10rpx;
    }

    .notify-item {
        font-size: 24rpx;
        margin-bottom: 6rpx;
    }

    .post-card {
        background: #fff;
        padding: 20rpx;
        border-radius: 12rpx;
        box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
        margin-bottom: 20rpx;
    }

    .post-title {
        font-size: 30rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
    }

    .post-meta {
        color: #888;
        font-size: 24rpx;
    }

    .load-status {
        text-align: center;
        color: #999;
        margin-top: 20rpx;
    }

    .search-bar {
        display: flex;
        gap: 10rpx;
        margin-bottom: 20rpx;
    }

    .input {
        flex: 1;
        padding: 10rpx;
        height: 100%;
        font-size: 28rpx;
        border: 1rpx solid #ccc;
        border-radius: 8rpx;
        box-sizing: border-box;
    }

    .btn {
        font-size: 28rpx;
        background-color: #1afa29;
        color: white;
        border: none;
        border-radius: 8rpx;
    }
</style>