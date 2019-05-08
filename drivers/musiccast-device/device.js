'use strict';

const Homey = require('homey');
const MusicCastDevice = require('./real-device');

const VOLUME_LIMIT_KEYS = ['maxVolume', 'minVolume'];

class HomeyMusicCastDevice extends Homey.Device {
    async onInit() {
        this.log('HomeyMusicCastDevice init');
        const { ip, maxVolume, minVolume } = this.getSettings();

        this.device = new MusicCastDevice({ ip, maxVolume, minVolume });

        this.registerCapabilityListener('onoff', this.onCapabilityOnOff.bind(this));
        this.registerCapabilityListener('volume_set', this.onCapabilityVolumeSet.bind(this));
        this.registerCapabilityListener('volume_mute', this.onCapabilityVolumeMute.bind(this));
    }

    async onCapabilityOnOff(isOn, options, callback) {
        try {
            await this.device.power(isOn);
            callback(null, isOn);
        } catch (e) {
            callback(e);
        }
    }

    async onCapabilityVolumeSet(volume, options, callback) {
        try {
            await this.device.setVolumeTo(volume);
            callback(null, volume);
        } catch (e) {
            callback(e);
        }
    }

    async onCapabilityVolumeMute(isMute, options, callback) {
        try {
            await this.device.mute(isMute);
            callback(null, isMute);
        } catch (e) {
            callback(e);
        }
    }

    async onSettings(oldSettingsObj, newSettingsObj, changedKeysArr) {
        VOLUME_LIMIT_KEYS.forEach((key) => {
            if (changedKeysArr.includes(key)) {
                this.device[key] = newSettingsObj[key];
            }
        });
    }

    onDeleted() {
        this.device.destroy();
    }
}

module.exports = HomeyMusicCastDevice;
