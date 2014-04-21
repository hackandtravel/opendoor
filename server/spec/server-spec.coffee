process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

proxyquire = require 'proxyquire'
clientSide = require '../clientSide.js'
https = require 'https' # change to http for http
adress = 'https://localhost:3001/opendoor/'
pwd = 'test'
user = 'test'
describe 'server', ->
  it 'should not contradict universal laws', ->
    expect(true).toBe(true)

  it 'should create an admin', (done)->
    https.get adress + 'createAdmin?user=test&pw=test', (res)->
      res.on 'data', (d)->
        expect(d).toBeDefined()
        done()

  describe 'clientSide', ->
    it 'shoulid create and return a device in json', (done)->
      https.get adress + 'createDevice?user='+test+'&pwd='+test+'&doors=2', (res)->
        res.on 'data', (d)->
          expect(d)
      done()


