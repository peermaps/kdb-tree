var kdbtree = require('../')

var kdb = kdbtree({ dim: 3 })
kdb.insert([1,2,3],'a')
kdb.insert([-5,10,2],'b')
kdb.insert([3,3,3],'c')
kdb.insert([-2,1,9],'d')

var q = [[-3,3],[2,20],[1,5]]
console.log(kdb.query(q))
