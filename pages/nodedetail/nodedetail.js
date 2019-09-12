//index.js
//获取应用实例
var v2ex = require('../../utils/api.js')
var util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    topics: [],
    title:''
  },
  fetchTopic: function(data) {
    wx.request({
      url: v2ex.getTopicInfo(data),
      success: res => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        res.data.forEach(e => {
          e.last_touched = util.formatTime(new Date(Number(e.last_touched + '000')))
        })
        this.setData({
          topics: res.data
        })
      }
    })
  },

  handleScroll(event) {
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
    this.setData({
      title:options.title
    })
    this.fetchTopic({
      node_name: this.data.title
    })
    wx.setNavigationBarTitle({
      title: options.name
    })
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

  },

  onPullDownRefresh: function () {
    this.setData({
      topics:[]
    })
    wx.showLoading({title:'加载中'})
    this.fetchTopic({
      node_name: this.data.title
    })
  },

})