'use strict';

const Yamaha = require('yamaha-yxc-nodejs');
const EventEmitter = require('events');
const { middleValueFromTriplet } = require('../../utils/middle-value-from-triplet');

const POLL_INTERVAL = 5 * 1000; // 5 seconds

class MusicCastDeviceFacade extends EventEmitter {
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
        super();
        this._ip = ip;
        this._pollInterval = null;
        this.maxVolume = maxVolume;
        this.minVolume = minVolume;
        this._device = new Yamaha(this._ip);

        this.syncState = this.syncState.bind(this);
        this.pollState = this.pollState.bind(this);

        this.pollState();
    }

    async pollState() {
        this._pollInterval = setInterval(this.syncState, POLL_INTERVAL);
    }

    async syncState() {
        const data = await this._device.getStatus();
        const { volume, mute, power, input } = JSON.parse(data);
        this.deviceVolume = volume;
        this.deviceMute = mute;
        this.devicePowerState = power;
        this.deviceInput = input;
    }

    get devicePowerState() {
        return this._power;
    }

    set devicePowerState(state) {
        const newPowerState = state === 'on';
        if (newPowerState !== this._power) {
            this._power = newPowerState;
            this.emit('onPowerStateChange', this._power);
        }
        return this._power;
    }

    get deviceVolume() {
        return this._volume;
    }

    set deviceVolume(value) {
        const newVolume = this.getRelativeDeviceVolume(parseInt(value, 10));
        if (newVolume !== this._volume) {
            this._volume = newVolume;
            this.emit('onDeviceVolumeChange', this._volume);
        }
        return this._volume;
    }

    get deviceMute() {
        return this._mute;
    }

    set deviceMute(value) {
        if (value !== this._mute) {
            this._mute = value;
            this.emit('onDeviceMuteChange', this._mute);
        }
        return this._mute;
    }

    get deviceInput() {
        return this._input;
    }

    set deviceInput(input) {
        if (input !== this._input) {
            this._input = input;
            this.emit('onDeviceInputChange', this._input);
        }
        return this._input;
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

    async selectInput(input) {
        return this._device.setInput(input);
    }

    // Convert percentage volume to device absolute volume, with custom volume limits
    getAbsoluteDeviceVolume(volumePercents) {
        return Math.round(this.minVolume + volumePercents * (this.maxVolume - this.minVolume));
    }

    getRelativeDeviceVolume(volumeAbs) {
        // volumeAbs should be between minVolume and maxVolume, if not, use corresponding min or max value
        const { minVolume, maxVolume } = this;
        const volume = middleValueFromTriplet(minVolume, maxVolume, volumeAbs);
        const volumeRelative = (volume - minVolume) / (maxVolume - minVolume);
        const volumePercents = Number.parseFloat(volumeRelative.toFixed(2));
        return volumePercents;
    }

    set maxVolume(volume) {
        if (volume <= this.minVolume) {
            throw Error('maxVolume should be greater then minVolume');
        }
        this._maxVolume = volume;
    }

    get maxVolume() {
        return this._maxVolume;
    }

    set minVolume(volume) {
        if (volume >= this.maxVolume) {
            throw Error('maxVolume should be greater then minVolume');
        }
        this._minVolume = volume;
    }

    get minVolume() {
        return this._minVolume;
    }

    destroy() {
        clearInterval(this._pollInterval);
    }
}

module.exports = MusicCastDeviceFacade;
