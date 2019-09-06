// pages/topic/topic.js
const moment = require('../../utils/moment-with-locales.min')
var v2ex = require('../../utils/api.js')
moment.locale('zh-cn', {
  longDateFormat: {
    l: "YYYY-MM-DD",
    L: "YYYY-MM-DD HH:mm"
  }
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic:{},
    replies:[],
    id:'',
    page:1,
    page_size:10,
    content:[{
      name:'div',
      attrs:{
        class: 'div_class'
      },
      children: [{
        type: 'text',
        text: ''
      }]
    }],
    nodes:''
  },
//
  fetchTopic: function () {
    let data = {
      topic_id:this.data.id,
      page:this.data.page,
      page_size:this.data.page_size
    }
    wx.request({
      url: v2ex.getReplies(data),
      success: res => {
        res.data.forEach(e => {
          e.created = moment(res.data.created).fromNow()
        })
        let list = this.data.replies.slice()
        list.push(...res.data)
        this.setData({
          replies: list
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.fetchTopic()
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', data=> { // 接受主题列表传回的数据
      data.data.created = moment.unix(data.data.created).fromNow()
      let nodes = this.data.content
      nodes[0].children[0].text = data.data.content
      this.setData({
        topic:data.data,
        content:nodes,
        nodes: data.data.content_rendered
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.setData({
    //   page: this.data.page+1
    // })
    // this.fetchTopic()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})