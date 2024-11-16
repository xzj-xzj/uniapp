const db = wx.cloud.database();

Page({
  data: {
    userInfo: {
      avatarUrl: '',
      name: '',
      gender: '',
      phone: '',
      openId: '' // 新增 openId 字段
    }
  },

  onLoad: function (options) {
    // 页面加载时调用获取用户信息的方法
    this.getUserInfo();
  },

  // 检查用户是否已经授权
  checkAuthorization: function () {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          this.getUserInfo();
        } else {
          // 用户未授权，提示用户授权
          wx.showModal({
            title: '提示',
            content: '需要您的授权才能正常使用功能',
            showCancel: false,
            confirmText: '确定',
            success: () => {
              this.getUserProfile();
            }
          });
        }
      },
      fail: (err) => {
        console.error('获取授权设置失败', err);
      }
    });
  },

  // 获取用户信息
  getUserInfo: function () {
    // 获取用户的 openId
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        const openId = res.result.openid;
        this.setData({
          'userInfo.openId': openId // 将 openId 存储到 userInfo 对象中
        });

        // 从云开发数据库中获取用户信息
        this.getSavedUserInfo(openId);
      },
      fail: err => {
        console.error('获取 openId 失败', err);
      }
    });
  },

  // 获取用户信息（包括头像、昵称等）
  getUserProfile: function () {
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const userInfo = res.userInfo;
        this.setData({
          'userInfo.avatarUrl': userInfo.avatarUrl,
          'userInfo.name': userInfo.nickName,
          'userInfo.gender': userInfo.gender === 1 ? '男' : '女',
          'userInfo.phone': '' // 默认为空，因为微信 API 不直接提供电话号码
        });

        // 获取用户的 openId
        this.getOpenId(userInfo);
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        wx.showToast({
          title: '获取用户信息失败，请手动输入信息',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 获取用户的 openId
  getOpenId: function (userInfo) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        const openId = res.result.openid;
        this.setData({
          'userInfo.openId': openId // 将 openId 存储到 userInfo 对象中
        });

        // 从云开发数据库中获取用户信息
        this.getSavedUserInfo(openId, userInfo);
      },
      fail: err => {
        console.error('获取 openId 失败', err);
      }
    });
  },

  // 从云开发数据库中获取用户信息
  getSavedUserInfo: function (openId, userInfo) {
    db.collection('userInformation').where({
      _openid: openId // 使用 _openid 字段进行查询
    }).get().then(res => {
      if (res.data.length > 0) {
        const savedUserInfo = res.data[0];
        this.setData({
          'userInfo.name': savedUserInfo.name || '',
          'userInfo.gender': savedUserInfo.gender || '',
          'userInfo.phone': savedUserInfo.phone || '',
          'userInfo.avatarUrl': savedUserInfo.avatarUrl || ''
        });
      } else if (userInfo) {
        // 如果没有找到用户信息，保存新的用户信息
        this.saveNewUser(userInfo, openId);
      }
    }).catch(err => {
      console.error('获取用户信息失败', err);
    });
  },

  // 保存新的用户信息
  saveNewUser: function (userInfo, openId) {
    db.collection('userInformation').add({
      data: {
        _openid: openId, // 使用 _openid 字段
        name: userInfo.nickName,
        gender: userInfo.gender === 1 ? '男' : '女',
        phone: '',
        avatarUrl: userInfo.avatarUrl
      }
    }).then(() => {
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      });
    }).catch(err => {
      console.error('保存用户信息失败', err);
    });
  },

  // 绑定名称输入框事件
  bindNameInput: function (e) {
    this.setData({
      'userInfo.name': e.detail.value
    });
  },

  // 绑定性别输入框事件
  bindGenderInput: function (e) {
    this.setData({
      'userInfo.gender': e.detail.value
    });
  },

  // 绑定电话输入框事件
  bindPhoneInput: function (e) {
    this.setData({
      'userInfo.phone': e.detail.value
    });
  },

  // 保存用户信息
  saveUserInfo: function () {
    const userInfo = this.data.userInfo;

    // 获取用户的 openId
    const openId = userInfo.openId;

    db.collection('userInformation').where({
      _openid: openId // 使用 _openid 字段进行查询
    }).get().then(res => {
      if (res.data.length > 0) {
        // 更新现有记录
        db.collection('userInformation').doc(res.data[0]._id).update({
          data: {
            name: userInfo.name,
            gender: userInfo.gender,
            phone: userInfo.phone
          }
        }).then(() => {
          wx.showToast({
            title: '更新成功',
            icon: 'success',
            duration: 2000
          });
        }).catch(err => {
          console.error('更新用户信息失败', err);
        });
      } else {
        // 添加新记录
        db.collection('userInformation').add({
          data: {
            _openid: openId, // 使用 _openid 字段
            name: userInfo.name,
            gender: userInfo.gender,
            phone: userInfo.phone,
            avatarUrl: userInfo.avatarUrl
          }
        }).then(() => {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
        }).catch(err => {
          console.error('保存用户信息失败', err);
        });
      }
    }).catch(err => {
      console.error('查询用户信息失败', err);
    });
  }
});