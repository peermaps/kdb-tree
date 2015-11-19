var median = require('median')
var REGION = 0, POINTS = 1

module.exports = KDB

function KDB (opts) {
  if (!(this instanceof KDB)) return new KDB(opts)
  this.a  = 4 // points
  this.b  = 3 // regions
  this.root = {
    type: REGION,
    regions: [
      {
        axis: 0,
        range: [-Infinity,Infinity],
        node: {
          type: POINTS,
          points: []
        }
      }
    ]
  }
}

KDB.prototype.query = function (q) {
  if (!Array.isArray(q[0])) q = q.map(function (x) { return [x,x] })
  return (function query (node) {
    var results = []
    if (node.type === REGION) {
      for (var i = 0; i < node.regions.length; i++) {
        var r = node.regions[i]
        if (overlapping(q[r.axis], r.range)) {
          results.push.apply(results, query(r.node))
        }
      }
    } else if (node.type === POINTS) {
      for (var i = 0; i < node.points.length; i++) {
        var p = node.points[i]
        if (overlappingPoint(q, p.point)) results.push(p)
      }
    }
    return results
  })(this.root)
}

KDB.prototype.insert = function (pt, value) {
  var self = this
  var q = [], rec = { point: pt, value: value }
  for (var i = 0; i < pt.length; i++) q.push([pt[i],pt[i]])
  return insert(this.root, [])

  function insert (node, parents) {
    if (node.type === REGION) {
      for (var i = 0; i < node.regions.length; i++) {
        var r = node.regions[i]
        if (overlapping(q[r.axis], r.range)) {
          var nparents = [{ node: node, index: i }].concat(parents)
          return insert(r.node, nparents)
        }
      }
    } else if (node.type === POINTS) {
      if (node.points.length < self.a) {
        node.points.push({ point: pt, value: value })
      } else pointOverflow(node, pt, parents)
    }
  }

  function pointOverflow (node, pt, parents) {
    // point overflow
    var axis = parents.length % pt.length
    var coords = []
    for (var i = 0; i < node.points.length; i++) {
      coords.push(node.points[i][axis])
    }
    var pivot = median(coords)
    var left = { type: POINTS, points: [] }
    var right = { type: POINTS, points: [] }
    if (pt[axis] < pivot) left.points.push(rec)
    else right.points.push(rec)

    for (var i = 0; i < node.points.length; i++) {
      var p = node.points[i]
      if (p.point[axis] < pivot) left.points.push(p)
      else right.points.push(p)
    }
    if (parents[0].node.regions.length >= self.b) {
      throw new Error('region overflow...')
    }
    var pnode = parents[0].node
    var pindex = parents[0].index
    var lrange = [pnode.regions[pindex].range[0],pivot]
    var rrange = [pivot,pnode.regions[pindex].range[1]]
    var lregion = { axis: axis, range: lrange, node: left }
    var rregion = { axis: axis, range: rrange, node: right }
    pnode.regions.splice(pindex, 1, lregion, rregion)
  }
}

function overlappingPoint (a, p) {
  for (var i = 0; i < a.length; i++) {
    if (!overlappingmm(a[i][0], a[i][1], p[i], p[i])) return false
  }
  return true
}

function overlappingmm (amin, amax, bmin, bmax) {
  return (amin >= bmin && amin <= bmax)
    || (amax >= bmin && amax <= bmax)
    || (amin < bmin && amax > bmax)
}

function overlapping (a, b) {
  return (a[0] >= b[0] && a[0] <= b[1])
    || (a[1] >= b[0] && a[1] <= b[1])
    || (a[0] < b[0] && a[1] > b[1])
}
