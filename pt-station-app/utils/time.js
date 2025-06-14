// utils/time.js
export function formatTime(timestamp) {
    const date = new Date(timestamp);
    const Y = date.getFullYear();
    const M = ("0" + (date.getMonth() + 1)).slice(-2);
    const D = ("0" + date.getDate()).slice(-2);
    const h = ("0" + date.getHours()).slice(-2);
    const m = ("0" + date.getMinutes()).slice(-2);
    const s = ("0" + date.getSeconds()).slice(-2);
    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}