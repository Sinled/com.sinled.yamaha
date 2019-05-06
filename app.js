'use strict';

const Homey = require('homey');
// const Yamaha = require('yamaha-yxc-nodejs');

class MyApp extends Homey.App {
    async onInit() {
        this.log('MyApp is running...');
        // const yamaha = new Yamaha('192.168.1.102');
        // const startTime = process.hrtime();
        // const result = await yamaha.getStatus();
        // const data = JSON.parse(result);
        // console.log(data);
        // const endTime = process.hrtime(startTime);
        // console.log(endTime);
        // console.log(result);
        // console.log('dest  ' + att.destination);
        // console.log('api  ' + att.api_version);
        // console.log(att);
    }
}

module.exports = MyApp;
