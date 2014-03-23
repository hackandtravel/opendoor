proxyquire = require 'proxyquire'

HIGH = 1;
LOW = 0;

gpioStub = {}

helpers = proxyquire '../helpers.js',
  'pi-gpio': gpioStub
  './config.js': 
    TIMEOUT: 1000
    BUZZ_TIME: 50
    DOOR_PINS:
      1: 'gpio0'
      2: 'gpio7'
      3: undefined
      
CALLBACK_JITTER = 100

describe 'raspberry', ->
  it 'should not contradict universal laws', ->
    expect(true).toBe(true)
    
  describe 'configurePins', ->
    it 'should configure 3 pins', (done) ->
      gpioStub.open = (pin, inputOrOutput, cb) ->
        expect(inputOrOutput).toBe('output');
        setTimeout cb, CALLBACK_JITTER * Math.random()
        
      gpioStub.write = (pin, highOrLow, cb) ->
        expect(highOrLow).toBe(LOW);
        setTimeout cb, CALLBACK_JITTER * Math.random()
          
      helpers.configurePins ->
        done()
      
    it 'should also return when an error occurs', (done) ->
      gpioStub.open = (pin, inputOrOutput, cb) ->
        setTimeout cb.bind(undefined, new Error('Mock error')), CALLBACK_JITTER * Math.random()

      gpioStub.write = (pin, highOrLow, cb) ->
        setTimeout cb.bind(undefined, new Error('Mock error')), CALLBACK_JITTER * Math.random()

      helpers.configurePins ->
        done()

    it 'should also return when some callback is not called (displays 3 error messages)', (done) ->
      gpioStub.open = ->
      gpioStub.write = ->

      helpers.configurePins ->
        done()
        
    , 1100 # TIMEOUT + X
    
  describe 'openDoor', ->
    it 'should open the door', (done) ->
      gpioStub.write = (pin, highOrLow, cb) ->
        expect(highOrLow).toBe(HIGH)
        setTimeout cb, CALLBACK_JITTER * Math.random()
        
        gpioStub.write = (pin, highOrLow, cb) ->
          expect(highOrLow).toBe(LOW)
          setTimeout cb, CALLBACK_JITTER * Math.random()
        
      i = 2
      helpers.openDoor 1, 500, (status) ->
        console.log status
        i--
        if i is 0 then done()
        
  describe 'onOpenDoor', ->
    it 'expects a doorNumber parameter', ->
      gpioStub.write = (x, y, cb) -> setTimeout cb, CALLBACK_JITTER * Math.random()
      expect(-> helpers.onOpenDoor({})).toThrow("Message does not contain 'doorNumber'")
      
    it 'open the door for a fixed time', (done) ->
      i = 2
      helpers.onOpenDoor doorNumber: 1, ->
        i--
        if i is 0 then done()
        
  describe 'connect', ->
    it 'should connet to a secure socket.io server', (done) ->
      fs = require('fs')
      
      options =
        key: fs.readFileSync(__dirname + '/secret/ryans-key.pem'),
        cert: fs.readFileSync(__dirname + '/secret/ryans-cert.pem')
        
      server = require('https').createServer(options)
      io = require('socket.io').listen(server);
      server.listen(3423)
      
      io.sockets.on 'connection', (socket) ->
        # TODO: More tests
        done()
    
      helpers.connect('http://localhost:3423'); 
