// components/customTabBar/index.js
Component({
  properties: {
    list: {
      type: Array,
      value: []
    },
    plusItem: {
      type: Object,
      value: {}
    }
  },
  methods: {
    switchTab(e) {
      const url = e.currentTarget.dataset.path;
      wx.switchTab({ url });
    }
  }
});