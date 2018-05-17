'use strict';

import {DEFAULT_OPTIONS, allOptionsKeys} from './constants';
import {type, clone} from './utils';

export default {
    get: function(data) {
        return browser.storage.local.get(data)
            .then(function(result) {
                if (null === data) {
                    result = Object.assign({}, DEFAULT_OPTIONS, result);
                } else if ('string' === type(data)) {
                    if (undefined === result[data]) {
                        result[data] = DEFAULT_OPTIONS[data];
                    }
                } else if (Array.isArray(data)) {
                    data.forEach(function(key) {
                        if (undefined === result[key]) {
                            result[key] = DEFAULT_OPTIONS[key];
                        }
                    });
                }

                // console.log('storage get', data, result);

                return result;
            });
    },
    clear: browser.storage.local.clear,
    remove: browser.storage.local.remove,
    async set(data, useClone = false) {
        if (useClone) {
            data = clone(data);
        }

        await browser.storage.local.set(data);

        let eventObj = {},
            doCallEvent = false,
            optionsKeys = Object.keys(data).filter(key => allOptionsKeys.includes(key));

        if (optionsKeys.length) {
            eventObj.optionsUpdated = optionsKeys;
            doCallEvent = true;
        }

        if (doCallEvent) {
            browser.runtime.sendMessage(eventObj);
        }
    },
}