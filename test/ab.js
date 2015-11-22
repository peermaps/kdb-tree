var kdbtree = require('../')
var test = require('tape')

test('a and b opts', function (t) {
  var n = 200
  var kdb = kdbtree({ dim: 3, a: 20, b: 15 })
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
  var expected = data.filter(function (p) {
    var pt = p.point
    return pt[0] >= 15 && pt[0] <= 50
      && pt[1] >= -60 && pt[1] <= 10
      && pt[2] >= 50 && pt[2] <= 100
  })
  t.deepEqual(pts.sort(ptcmp), expected.sort(ptcmp))
  t.end()
})

function ptcmp (a, b) {
  var sa = JSON.stringify(a)
  var sb = JSON.stringify(b)
  return sa < sb ? -1 : 1
}
