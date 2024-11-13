Page({
  data: {
    cityText: '未知' // 初始值为“未知”
  },

  onLoad: function(options) {
    // 页面加载时执行的函数
  },

  chooseLocation: function() {
    wx.chooseLocation({
      success: (res) => {
        const name = res.name; // 地址名称
        const address = res.address; // 地址详情
        const latitude = res.latitude; // 纬度
        const longitude = res.longitude; // 经度
        console.log('地址名称：' + name);
        console.log('地址详情：' + address);
        console.log('纬度：' + latitude);
        console.log('经度：' + longitude);

        // 截取地址名称，超过10个字符的部分用省略号代替
        const truncatedName = name.length > 10 ? name.slice(0, 10) + '...' : name;

        // 更新页面数据
        this.setData({
          cityText: truncatedName
        });

        // 显示提示信息
        wx.showToast({
          title: `地址：${address}，纬度：${latitude}，经度：${longitude}`,
          icon: 'none',
          duration: 3000
        });
      },
      fail: (err) => {
        console.error('选择位置失败：', err);
        wx.showToast({
          title: '选择位置失败，请检查权限设置',
          icon: 'none',
          duration: 3000
        });
      }
    });
  }
});