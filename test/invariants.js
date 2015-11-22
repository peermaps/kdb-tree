var kdbtree = require('../')
var test = require('tape')

test('invariants', function (t) {
  var n = 200
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
    var ok = invariants(kdb.root)
    t.ok(ok, 'invariants')
    if (!ok) console.log(require('util').inspect(kdb.root,0,2000))
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

function invariants (tree) {
  if (!tree.regions) {
    console.log('!!! no regions for:', tree)
    return false
  }
  return tree.regions.every(function (r) {
    if (r.node.type === 0) {
      return r.node.regions.every(function (cr) {
        return cr.range.every(function (rr, i) {
          var ok = r.range[i][0] <= rr[0] && rr[0] <= r.range[i][1]
            && r.range[i][0] <= rr[1] && rr[1] <= r.range[i][1]
          var subok = cr.node.type === 1 || invariants(cr.node)
          if (!ok) console.log('!!!cmp-r',
            r.range[i][0], '<=', rr[0], '<=', r.range[i][1],
            'and',
            r.range[i][0], '<=', rr[1], '<=', r.range[i][1])
          return ok && subok
        })
      })
    } else if (r.node.type === 1) {
      return r.node.points.every(function (p) {
        return p.point.every(function (x, i) {
          var ok = x >= r.range[i][0] && x <= r.range[i][1]
          if (!ok) console.log('!!!cmp-p', r.range[i][0], '<=', x, '<=', r.range[i][1])
          return ok
        })
      })
    } else return false
  })
}
