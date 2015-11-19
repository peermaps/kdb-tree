var kdbtree = require('../')
var test = require('tape')

test('points', function (t) {
  var n = 20
  var kdb = kdbtree()
  var data = []
  for (var i = 0; i < n; i++) {
    var x = Math.random() * 200 - 100
    var y = Math.random() * 200 - 100
    var z = Math.random() * 200 - 100
    var loc = Math.floor(Math.random() * 1000)
    data.push({ point: [x,y,z], value: loc })
    kdb.insert([x,y,z],loc)
    var pts = kdb.query([x,y,z])
    t.deepEqual(pts, [ { point: [x,y,z], value: loc } ])
  }

  var pts = kdb.query([[15,50],[-60,10],[50,100]])
  var expected = data.filter(function (pt) {
    return pt[0] >= 15 && pt[0] <= 50
      && pt[1] >= -60 && pt[1] <= 10
      && pt[2] >= 50 && pt[2] <= 100
  })
  t.deepEqual(pts, expected)
  t.end()
})
