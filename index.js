var request = require('request');
var Service, Characteristic;

module.exports = function(homebridge)
{
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-spaceapi', 'SpaceAPI', Spacestate);
}

class Spacestate
{
    constructor(log, config)
    {
        this.log = log;
        this.config = config;
        this.name = this.config['name'];

        this.service = new Service.ContactSensor(this.name);
        this.service
            .getCharacteristic(Characteristic.ContactSensorState)
            .setValue(false);

        this.service
            .getCharacteristic(Characteristic.ContactSensorState)
            .on('get', this.getState.bind(this));
    }

    getState(callback)
    {
        request(this.config['url'], function (error, response) {
            if (response.statusCode == 200)
            {
                var spaceAPI = JSON.parse(response.body);

                callback(null, spaceAPI['state']['open']);
            }
            else
            {
                callback(null, false);;
            }
        }.bind(this));
    }

    getServices()
    {
        return [this.service];
    }
}
