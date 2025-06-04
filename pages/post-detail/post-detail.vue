<template>
    <view class="container" v-if="post">
        <view class="title">{{ post.title }}</view>
        <view class="meta">
            作者：{{ post.username }} ｜ 发布时间：{{ formatTime(post.createdAt) }}
        </view>
        <view class="meta">
            浏览：{{ post.viewCount }} ｜ 点赞：{{ likeCount }}
        </view>

        <!-- Markdown 渲染 -->
        <view class="markdown" v-html="renderedMarkdown"></view>

        <!-- 点赞和评论按钮 -->
        <view class="actions">
            <text :class="['like', liked ? 'liked' : '']" @tap="handleLike">👍 {{ likeCount }}</text>
            <text class="comment-icon">💬 评论</text>
        </view>

        <!-- 评论输入 -->
        <view class="comment-box">
            <textarea v-model="commentText" placeholder="写下你的评论..." />
            <button @tap="handleComment">发布评论</button>
        </view>

        <!-- 评论列表 -->
        <view class="comments">
            <view class="comment" v-for="item in commentList" :key="item.commentId">
                <view class="comment-header">
                    <text class="comment-user">{{ item.username === userName ? '你' : item.username }}</text>
                    <text class="comment-time">{{ formatTime(item.createdAt) }}</text>
                </view>
                <view class="comment-content">{{ item.content }}</view>
                <view v-if="isAdmin || item.username === userName" class="comment-delete"
                    @tap="handleDeleteComment(item)">🗑 删除</view>
            </view>
        </view>
    </view>
</template>

<script setup>
    import {
        onLoad
    } from '@dcloudio/uni-app'
    import {
        ref
    } from 'vue'
    import dayjs from 'dayjs'
    import {
        marked
    } from 'marked'
    import {
        request
    } from "@/utils/request.js";

    const post = ref(null)
    const id = ref('')
    const likeCount = ref(0)
    const liked = ref(false)
    const commentText = ref('')
    const commentList = ref([])

    const userName = uni.getStorageSync('userName') || ''
    const isAdmin = uni.getStorageSync('role') === 'ADMIN'

    // 渲染 Markdown 为 HTML
    const renderedMarkdown = ref('')

    // 加载帖子详情
    const fetchPostDetail = async () => {
        console.log(id.value)
        try {
            const res = await request({
                url: `/forum2/posts/${id.value}`,
                method: 'GET'
            })
            if (res) {
                post.value = res
                likeCount.value = res.likeCount || 0
                liked.value = res.isLiked || false
                renderedMarkdown.value = marked.parse(res.content || '')
            }
        } catch (err) {
            uni.showToast({
                icon: 'none',
                title: '加载帖子失败'
            })
        }
    }

    // 拉取评论
    const fetchComments = async () => {
        try {
            const res = await request({
                url: `/forum2/posts/${id.value}/comments`,
                method: 'GET',
                data: {
                    pageNum: 1,
                    pageSize: 100
                }
            })
            commentList.value = res?.records || []
        } catch (err) {
            uni.showToast({
                icon: 'none',
                title: '加载评论失败'
            })
        }
    }

    // 点赞
    const handleLike = async () => {
        if (liked.value) {
            uni.showToast({
                icon: 'none',
                title: '你已经点过赞了'
            })
            return
        }
        try {
            await request({
                url: `/forum2/posts/${id.value}/like`,
                method: 'POST'
            })
            likeCount.value++
            liked.value = true
        } catch {
            uni.showToast({
                icon: 'none',
                title: '点赞失败'
            })
        }
    }

    // 发布评论
    const handleComment = async () => {
        if (!commentText.value.trim()) {
            uni.showToast({
                icon: 'none',
                title: '评论不能为空'
            })
            return
        }
        try {
            await request({
                url: `/forum2/posts/${id.value}/comments`,
                method: 'POST',
                data: {
                    content: commentText.value
                }
            })
            commentText.value = ''
            await fetchComments()
            uni.showToast({
                icon: 'success',
                title: '评论成功'
            })
        } catch {
            uni.showToast({
                icon: 'none',
                title: '评论失败'
            })
        }
    }

    // 删除评论
    const handleDeleteComment = async (item) => {
        uni.showModal({
            title: '确认删除',
            content: '确定要删除这条评论吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        await request({
                            url: `/forum2/comments/${item.commentId}`,
                            method: 'DELETE'
                        })
                        uni.showToast({
                            icon: 'success',
                            title: '删除成功'
                        })
                        await fetchComments()
                    } catch {
                        uni.showToast({
                            icon: 'none',
                            title: '删除失败'
                        })
                    }
                }
            }
        })
    }

    // 时间格式化
    const formatTime = (t) => dayjs(t).format('YYYY-MM-DD HH:mm:ss')

    // 页面加载
    onLoad((query) => {
        id.value = query.id
        fetchPostDetail()
        fetchComments()
    })
</script>

<style scoped>
    .container {
        padding: 30rpx;
    }

    .title {
        font-size: 40rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
    }

    .meta {
        color: #888;
        font-size: 24rpx;
        margin-bottom: 10rpx;
    }

    .markdown {
        font-size: 30rpx;
        line-height: 1.6;
        background: #fff;
        padding: 20rpx;
        border-radius: 10rpx;
        margin-top: 20rpx;
    }

    .actions {
        display: flex;
        gap: 30rpx;
        margin: 30rpx 0;
        font-size: 32rpx;
    }

    .like.liked {
        color: #eb2f96;
    }

    .comment-box textarea {
        width: 100%;
        min-height: 100rpx;
        margin-top: 20rpx;
        padding: 10rpx;
        border: 1rpx solid #ccc;
        border-radius: 10rpx;
    }

    .comment-box button {
        margin-top: 10rpx;
        width: 100%;
    }

    .comments {
        margin-top: 40rpx;
    }

    .comment {
        padding: 20rpx 0;
        border-bottom: 1rpx solid #eee;
    }

    .comment-header {
        display: flex;
        justify-content: space-between;
        color: #888;
        font-size: 24rpx;
    }

    .comment-content {
        margin-top: 10rpx;
        font-size: 28rpx;
    }

    .comment-delete {
        text-align: right;
        color: red;
        font-size: 24rpx;
        margin-top: 10rpx;
    }
</style>