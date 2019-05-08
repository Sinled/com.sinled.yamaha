'use strict';

const Homey = require('homey');
const MusicCastDevice = require('./music-cast-facade');

const VOLUME_LIMIT_KEYS = ['maxVolume', 'minVolume'];

class HomeyMusicCastDevice extends Homey.Device {
    async onInit() {
        this.log('HomeyMusicCastDevice init');
        const { ip, maxVolume, minVolume } = this.getSettings();

        this.device = new MusicCastDevice({ ip, maxVolume, minVolume });

        this.setupListeners();
    }

    setupListeners() {
        // Homey devices listeners
        this.registerCapabilityListener('onoff', this.onCapabilityOnOff.bind(this));
        this.registerCapabilityListener('volume_set', this.onCapabilityVolumeSet.bind(this));
        this.registerCapabilityListener('volume_mute', this.onCapabilityVolumeMute.bind(this));
        // Real devices listeners
        this.device.on('onPowerStateChange', this.onRealDeviceStateChange.bind(this, 'onoff'));
        this.device.on('onDeviceVolumeChange', this.onRealDeviceStateChange.bind(this, 'volume_set'));
        this.device.on('onDeviceMuteChange', this.onRealDeviceStateChange.bind(this, 'volume_mute'));
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

    onRealDeviceStateChange(capability, newValue) {
        const currentValue = this.getCapabilityValue(capability);
        if (currentValue !== newValue) {
            this.setCapabilityValue(capability, newValue);
        }
    }

    async onSettings(oldSettingsObj, newSettingsObj, changedKeysArr) {
        // If user is trying to change volume limits, validate and sync data with facade
        VOLUME_LIMIT_KEYS.forEach((key) => {
            if (changedKeysArr.includes(key)) {
                this.device[key] = newSettingsObj[key];
            }
        });
    }

    onDeleted() {
        this.device.removeAllListeners();
        this.device.destroy();
    }
}

module.exports = HomeyMusicCastDevice;
