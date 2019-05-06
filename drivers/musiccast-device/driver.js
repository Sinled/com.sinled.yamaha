'use strict';

const Homey = require('homey');
const Yamaha = require('yamaha-yxc-nodejs');

class MyDriver extends Homey.Driver {
    onInit() {
        this.log('MyDriver has been inited');
    }

    async onPairListDevices(data, callback) {
        const yamaha = new Yamaha();
        try {
            const [ip, name, _, id] = await yamaha.discover();
            callback(null, [
                {
                    name,
                    data: {
                        id,
                        ip,
                    },
                },
            ]);
        } catch (e) {
            callback(e);
        }
    }
}

module.exports = MyDriver;
