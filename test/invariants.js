var kdbtree = require('../')
var test = require('tape')

test('invariants', function (t) {
  var n = 20
  var kdb = kdbtree({ dim: 3 })
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
    t.ok(invariants(kdb.root), 'invariants')
  }

  var pts = kdb.query([[15,50],[-60,10],[50,100]])
  var expected = data.filter(function (p) {
    var pt = p.point
    return pt[0] >= 15 && pt[0] <= 50
      && pt[1] >= -60 && pt[1] <= 10
      && pt[2] >= 50 && pt[2] <= 100
  })
  t.deepEqual(pts, expected)
  t.end()
})

function invariants (tree) {
  return tree.regions.every(function (r) {
    if (r.node.type === 0) {
      r.node.regions.every(function (cr) {
        return cr.range.every(function (rr, i) {
          return rr[0] >= r.range[i][0] && rr[0] <= r.range[i][1]
            && rr[1] >= r.range[i][0] && rr[1] <= r.range[i][1]
            && (cr.node.type === 1 || invariants(cr.node))
        })
      })
    } else if (r.node.type === 1) {
      return r.node.points.every(function (p) {
        return p.point.every(function (x, i) {
          return x >= r.range[i][0] && x <= r.range[i][1]
        })
      })
    } else return false
  })
}
