'use strict'

// クリアランプを保存するlocalStorageのキー
const storageKey = 'lamps'

// クリアランプの色
const lampColors = ['#dddddd', '#ccffcc', '#ffffcc', '#ffcccc', '#ffffff', '#ccccff']

// クリアランプ読み込み
const storedLamps = JSON.parse(localStorage.getItem(storageKey) || '[]')

charts.forEach((chart, i) => {
  // クリアランプの初期化
  chart.id = i
  chart.lamp = storedLamps[i] || 0
  chart.lampColor = lampColors[chart.lamp]

  // URLにscoreId付加
  if (chart.scoreId) {
    const urlObj = new URL(chart.url)
    urlObj.searchParams.append('scoreId', chart.scoreId)
    chart.url = urlObj.toString()
  }
})

// タイトル、難易度でソート
const orderBy = (key, compare) => (a, b) =>
  compare ? compare(a[key], b[key]) : a[key] - b[key]
charts.sort(orderBy('title', (a, b) => a.localeCompare(b, 'ja')))
charts.sort(orderBy('level'))

// 難易度先頭にマーク(区切り表示用)
let currentLevel = 0
charts.forEach(chart => {
  if (chart.level != currentLevel) {
    chart.levelBorder = 'true'
    currentLevel = chart.level
  }
})

// Vueインスタンス作成
const app = new Vue({
  el: '#app',
  data: {
    charts: charts
  },
  methods: {
    // クリアランプ変更
    changeLamp: id => {
      const chart = charts.find(chart => chart.id === id)
      chart.lamp = (chart.lamp + 1) % lampColors.length
      chart.lampColor = lampColors[chart.lamp]

      const lamps = charts.slice().sort(orderBy('id')).map(chart => chart.lamp)
      localStorage.setItem(storageKey, JSON.stringify(lamps))
    }
  }
})
