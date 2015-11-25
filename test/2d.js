var kdbtree = require('../')
var test = require('tape')

test('2d', function (t) {
  var n = 200
  var kdb = kdbtree({ dim: 2 })
  var data = []
  for (var i = 0; i < n; i++) {
    var pt = [
      Math.random() * 200 - 100,
      Math.random() * 200 - 100
    ]
    var loc = Math.floor(Math.random() * 1000)
    data.push({ point: pt, value: loc })
    kdb.insert(pt,loc)
    var pts = kdb.query(pt)
    t.deepEqual(pts, [ { point: pt, value: loc } ])
  }

  var q = [ [20,30], [-60,40] ]
  var pts = kdb.query(q)
  var expected = data.filter(function (p) {
    var pt = p.point
    for (var i = 0; i < q.length; i++) {
      if (pt[i] < q[i][0] || pt[i] > q[i][1]) return false
    }
    return true
  })
  t.deepEqual(pts.sort(ptcmp), expected.sort(ptcmp))
  t.end()
})

function ptcmp (a, b) {
  var sa = JSON.stringify(a)
  var sb = JSON.stringify(b)
  return sa < sb ? -1 : 1
}
