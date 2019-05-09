const { ManagerI18n } = require('homey');
const lang = ManagerI18n.getLanguage();

/**
 * Transforms values from capability list, input autocomplete list
 * @param {{title: object, id: string}[]} capabilityValues
 * @returns {{name: string, id: string}[]}
 */
const buildCapabilityAutocompleteList = (capabilityValues = []) => {
    return capabilityValues.map(({ id, title }) => {
        return {
            id,
            name: title[lang] || title.en,
        };
    });
};

module.exports = {
    buildCapabilityAutocompleteList,
};
