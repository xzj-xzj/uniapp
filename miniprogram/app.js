// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: "",
        traceUser: true,
      });
    }

    this.globalData = {};
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或更高版本的基础库');
    } else {
      wx.cloud.init({
        traceUser: true,
      });
    }
  },
  onLaunch: function () {
    wx.cloud.init({
      env: 'hzcu32201059xzj-9g2wphee8694f834'
    });
    // 调用login云函数
wx.cloud.callFunction({
  name: 'Get_Openid',
  success(res) {
    console.log(res);
    console.log(res.result.openid);
    // 进行全局配置
    this.globalData.openid = res.result.openid;
    console.log(this.globalData.openid);
  }
});


  },
  
});

