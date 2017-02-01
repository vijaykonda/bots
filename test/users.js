
const test = require('tape')
const low = require('lowdb')
const {
  shallowClone,
  setDBSchema
} = require('../lib/utils')

const manageUsers = require('../lib/users')

test('users', function (t) {
  const users = manageUsers(createDB())
  t.same(users.list(), {})

  const ted = { name: 'ted' }
  users.create('ted', ted)

  const expected = {
    id: 'ted',
    name: 'ted',
    history: []
  }

  t.same(users.list(), { ted: expected })

  t.throws(function () {
    users.create('ted')
  }, /exists/)

  const update = shallowClone(expected)
  update.likes = 'stuff'
  users.save(update)
  t.same(users.list(), { ted: update })

  users.del('ted')
  t.same(users.list(), {})

  users.create('ted', ted)
  t.ok(users.list().ted)
  users.clear()
  t.same(users.list(), {})

  t.end()
})

function createDB() {
  return setDBSchema(low())
}
