// XXX: Works where I am...
exports.location =  '192.168.1.213:3000';

/**
 * On which gpio pin are the doors connected?
 * Must be one of the keys in PIN_MAPPING.
 */
exports.DOOR_PINS = {
  1: 'gpio0',
  2: undefined, // TODO
  3: undefined  // TODO
};

/**
 * How long should the door buzz? In milliseconds.
 *
 * @type {number}
 */
exports.BUZZ_TIME = 4000;

/**
 * How log should the time between reconnects be? In milliseconds.
 *
 * @type {number}
 */
exports.RECONNECT_INTERVAL = 10000;

/**
 * Pin mapping of the Raspberry Pi
 * 'pin' is the number of the pin if counted form the top
 * 'bcm' is the number used by the underlying Broadcom chip
 */
exports.PIN_MAPPING = {
  gpio7: {pin: 7, bcm: 4},
  gpio0: {pin: 11, bcm: 17}, gpio1: {pin: 12, bcm: 18},
  gpio3: {pin: 15, bcm: 22}, gpio4: {pin: 16, bcm: 23},
  gpio5: {pin: 18, bcm: 24},
  gpio6: {pin: 25, bcm: 25}
};

exports.TIMEOUT = 10000;
