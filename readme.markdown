# kdb-tree

in-memory kdb tree

# example

``` js
var kdbtree = require('kdb-tree')

var kdb = kdbtree({ dim: 3 })
kdb.insert([1,2,3],'a')
kdb.insert([-5,10,2],'b')
kdb.insert([3,3,3],'c')
kdb.insert([-2,1,9],'d')

var q = [[-3,3],[2,20],[1,5]]
console.log(kdb.query(q))
```

output:

```
[ { point: [ 1, 2, 3 ], value: 'a' },
  { point: [ 3, 3, 3 ], value: 'c' } ]
```

# api

``` js
var kdbtree = require('kdb-tree')
```

## var kdb = kdbtree(opts)

* `opts.dim` - dimension to use for points (required)
* `opts.a` - number of points per page (default: 4)
* `opts.b` - number of regions per page (default: 3)

## kdb.insert(pt, value)

Insert a point `pt` with a `value`.

## var results = kdb.query(q)

Return an array of `results` from a bounding box query `q`.
`q` is an array or `[min,max]` arrays for each dimension.

Each result in the `results` array is an object with `point` and `value`
properties.

# install

```
npm install kdb-tree
```

# license

BSD
