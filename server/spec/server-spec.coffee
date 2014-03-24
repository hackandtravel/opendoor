proxyquire = require 'proxyquire'

helpers = proxyquire '../helpers.js',
  './serverSide..js':

describe 'server', ->
  it 'should not contradict universal laws', ->
    expect(true).toBe(true)
