/**
 * Created by Frank on 15/10/14.
 */
'use strict';

var middleWare = {
    debug: function *(next) {
        console.log(this.request.method + ':', this.request.url);
        if (this.request.method === 'GET') {
            console.log('Request:', this.request.query);
        } else {
            console.log('Request: ', this.request.body);
        }
        yield next;
        console.log('Response: ', this.body);
    }
};

module.exports = exports = middleWare;
