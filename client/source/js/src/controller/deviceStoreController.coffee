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
      deviceIds = deviceIds.concat(device.deviceid)
      this.setItem(this.key, deviceIds)
      this.setItem(device.deviceid, device)

    fetchAll: ->
      deviceIds = this.getItem(this.key) or []
      deviceIds.map(this.fetch.bind(this))

    fetch: (id) -> new Device(this.getItem(id)) or {}

  singleton = -> new DeviceStoreController
  singleton()
