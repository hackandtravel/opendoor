define [
  'model/Device'
], (Device) ->
  class DeviceStoreController
    key: 'deviceIds',

    setItem: (key, item) ->
      localStorage.setItem(key, JSON.stringify(item))

    getItem: (key) ->
      json = localStorage.getItem(key)
      if json
        return JSON.parse(json)
      else
        console.warn('Could not find ' + key + ' in localStore')
        return null

    save: (device) ->
      deviceIds = this.getItem(this.key) or []
      this.setItem(device.deviceid, device)
      
      if deviceIds.indexOf(device.deviceid) is -1
        deviceIds = deviceIds.concat(device.deviceid)
        this.setItem(this.key, deviceIds)
        return true
        
      return false

    fetchAll: ->
      deviceIds = this.getItem(this.key) or []
      deviceIds.map(this.fetch.bind(this))

    fetch: (id) -> new Device(this.getItem(id)) or {}

  singleton = -> new DeviceStoreController
  singleton()
