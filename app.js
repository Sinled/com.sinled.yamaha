'use strict';

const Homey = require('homey');
const appData = require('./app.json');
const { buildCapabilityAutocompleteList } = require('./utils/build-capability-autocomplete-list');

const INPUT_SELECT_AUTOCOMPLETE_LIST = appData.capabilities.input_select.values;

class MyApp extends Homey.App {
    async onInit() {
        this.log('MyApp is running...');
        this.registerFlowActions();
    }

    registerFlowActions() {
        const inputSelectAction = new Homey.FlowCardAction('input_select');
        inputSelectAction
            .register()
            .registerRunListener(async ({ input, device }) => {
                return device.triggerCapabilityListener('input_select', input.id);
            })
            .getArgument('input')
            .registerAutocompleteListener(async () => {
                return buildCapabilityAutocompleteList(INPUT_SELECT_AUTOCOMPLETE_LIST);
            });
    }
}

module.exports = MyApp;
