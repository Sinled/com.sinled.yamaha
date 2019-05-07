'use strict';

const Homey = require('homey');
const MusicCastDevice = require('./real-device');

class MusicCastDriver extends Homey.Driver {
    onInit() {
        this.log('MusicCastDriver has been inited');
    }

    async onPairListDevices(data, callback) {
        try {
            const devices = await MusicCastDevice.discover();
            callback(null, devices);
        } catch (e) {
            callback(e);
        }
    }
}

module.exports = MusicCastDriver;
