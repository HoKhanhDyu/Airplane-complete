export const showPrice = (price) => {
    if (!price) return 0;
    return price.toLocaleString('vi-VN');
}