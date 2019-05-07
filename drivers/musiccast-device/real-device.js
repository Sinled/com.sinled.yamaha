'use strict';

const Yamaha = require('yamaha-yxc-nodejs');

class MusicCastDevice {
    static async discover() {
        const yamaha = new Yamaha();
        const [ip, name, model, id] = await yamaha.discover();

        return [
            {
                name: `[${model}] ${name}`,
                data: {
                    id,
                },
                settings: {
                    ip,
                },
            },
        ];
    }

    constructor({ ip, maxVolume, minVolume }) {
        this._ip = ip;
        this.maxVolume = maxVolume;
        this.minVolume = minVolume;
        this._device = new Yamaha(this._ip);
    }

    async power(on) {
        if (on) {
            return this._device.powerOn();
        } else {
            return this._device.powerOff();
        }
    }

    async mute(mute) {
        if (mute) {
            return this._device.muteOn();
        } else {
            return this._device.muteOff();
        }
    }

    async setVolumeTo(value) {
        let absoluteDeviceVolume = this.getAbsoluteDeviceVolume(value);
        return this._device.setVolumeTo(absoluteDeviceVolume);
    }

    // Convert percentage volume to device absolute volume, with custom volume limits
    getAbsoluteDeviceVolume(volume) {
        return Math.round(this.minVolume + volume * (this.maxVolume - this.minVolume));
    }

    set maxVolume(volume) {
        if (volume < this.minVolume) {
            throw Error('maxVolume should be greater then minVolume');
        }
        this._maxVolume = volume;
    }

    get maxVolume() {
        return this._maxVolume;
    }

    set minVolume(volume) {
        if (volume > this.maxVolume) {
            throw Error('maxVolume should be greater then minVolume');
        }
        this._minVolume = volume;
    }

    get minVolume() {
        return this._minVolume;
    }
}

module.exports = MusicCastDevice;
