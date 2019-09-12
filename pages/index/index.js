//index.js
//获取应用实例
var v2ex = require('../../utils/api.js')
var util = require('../../utils/util.js')
const moment = require('../../utils/moment-with-locales.min')
const app = getApp()

Page({
  data: {
    hotNodes: [{
        'short_name': 'latest',
        'full_name': '最新'
      },
      {
        'short_name': 'hot',
        'full_name': '最热'
      },
      {
        'short_name': 'share',
        'full_name': '分享发现'
      },
      {
        'short_name': 'create',
        'full_name': '分享创造'
      },
      {
        'short_name': 'programmer',
        'full_name': '程序员'
      },
      {
        'short_name': 'bb',
        'full_name': '宽带症候群'
      },
      {
        'short_name': 'all4all',
        'full_name': '二手交易'
      },

    ],
    active: 'latest',
    topics: [],
  },
  // 获取最新列表
  fetchLatest: function() {
    wx.request({
      url: v2ex.getLatestTopic({
        p: 1
      }),
      success: res => {
        console.log(res.data)
        res.data.forEach(e => {
          e.last_touched = moment.unix(e.last_touched).fromNow()
        })
        this.setData({
          topics: res.data
        })
      }
    })
  },
  fetchHot: function() {
    wx.request({
      url: v2ex.getHotestTopic({}),
      success: res => {
        console.log(res.data)
        res.data.forEach(e => {
          e.last_touched = moment.unix(e.last_touched).fromNow()
        })
        this.setData({
          topics: res.data
        })
      }
    })
  },
  fetchTopic: function(data) {
    wx.request({
      url: v2ex.getTopicInfo(data),
      success: res => {
        res.data.forEach(e => {
          e.last_touched = moment.unix(e.last_touched).fromNow()
        })
        this.setData({
          topics: res.data
        })
      }
    })
  },
  // 导航点击事件
  tapNav(event) {
    let name = event.currentTarget.dataset.name
    this.setData({
      topics: []
    })
    if (name === 'latest') {
      this.fetchLatest()
    } else if (name === 'hot') {
      this.fetchHot()
    } else {
      this.fetchTopic({
        node_name: name
      })
    }
    this.setData({
      active: name
    })
  },

  handleScroll(event) {
    console.log(event)
  },

  // 主题点击事件 
  navToTopic(event) {
    wx.showLoading({
      title: '加载中',
    })
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/topic/topic?id=' + id,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          console.log(data)
        },
        // someEvent: function(data) {
        //     console.log(data)
        //   }
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: event.currentTarget.dataset.topic
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.fetchLatest()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  }

})