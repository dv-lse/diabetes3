import test from 'tape'

// ONLY tests the central weighted-mean calculation

test('A passing test', (t) => {
  t.pass('This test will pass.')
  t.end()
})

test('Assertions with tape.', (t) => {
  const expected = 'something to test'
  const actual = 'sonething to test'
  t.equal(actual, expected,
    'Given two mismatched values, .equal() should produce a nice bug report')
  t.end()
})
