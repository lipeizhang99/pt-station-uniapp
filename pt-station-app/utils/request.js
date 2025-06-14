const BASE_URL = "http://172.20.10.6:8080";

export function request({
    url,
    method = "GET",
    data = {},
    params = {}, // 👈 新增 params 支持
    header = {}
}) {
    return new Promise((resolve, reject) => {
        const token = uni.getStorageSync("token");

        // 👇 如果是 GET 且有 params，则拼接到 URL
        if (method.toUpperCase() === 'GET' && Object.keys(params).length > 0) {
            const queryString = Object.entries(params)
                .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
                .join('&');
            url += (url.includes('?') ? '&' : '?') + queryString;
        }

        uni.request({
            url: BASE_URL + url,
            method,
            data: method.toUpperCase() === 'GET' ? undefined : data, // GET 不发 data
            header: {
                "Content-Type": "application/json",
                Authorization: token || "",
                ...header,
            },
            timeout: 5000,

            success: (res) => {
                const code = res.data.code;
                if (code !== 200) {
                    uni.showToast({
                        title: res.data.message || "请求失败",
                        icon: "none",
                    });

                    if (code === 401 || code === 600) {
                        uni.showToast({
                            title: '请重新登录',
                            icon: 'none',
                        })
                        uni.removeStorageSync("token");
                        setTimeout(() => {
                            uni.reLaunch({
                                url: "/pages/login/login"
                            });
                        }, 1000);
                    }

                    reject(res.data.message || "请求失败");
                } else {
                    resolve(res.data.data);
                }
            },

            fail: (err) => {
                uni.showToast({
                    title: "网络错误，请稍后再试",
                    icon: "none",
                });
                reject(err);
            },
        });
    });
}