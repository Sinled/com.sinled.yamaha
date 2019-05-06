'use strict';

const Homey = require('homey');
const Yamaha = require('yamaha-yxc-nodejs');

class MusicCastDriver extends Homey.Driver {
    onInit() {
        this.log('MusicCastDriver has been inited');
    }

    async onPairListDevices(data, callback) {
        const yamaha = new Yamaha();
        try {
            const [ip, name, model, id] = await yamaha.discover();
            callback(null, [
                {
                    name: `[${model}] ${name}`,
                    data: {
                        id,
                    },
                    settings: {
                        ip,
                    },
                },
            ]);
        } catch (e) {
            callback(e);
        }
    }
}

module.exports = MusicCastDriver;
