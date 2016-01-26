//
// Copied from https://github.com/robdodson/defcon and modified
//

var util    = require('util'),
    events  = require('events')
    _       = require('underscore');

// ---------------------------------------------
// Constructor
// ---------------------------------------------
function Stopwatch() {
    if(false === (this instanceof Stopwatch)) {
        return new Stopwatch();
    }

    this.hour = 3600000;
    this.minute = 60000;
    this.second = 1000;
    this.startTime = this.hour;
    this.time = this.startTime;
    this.interval = undefined;

    events.EventEmitter.call(this);

    // Use Underscore to bind all of our methods
    // to the proper context
    _.bindAll(this, 'start', 'stop', 'reset', 'onTick', 'formatTime', 'getTime', 'isRunning');
};

// ---------------------------------------------
// Inherit from EventEmitter
// ---------------------------------------------
util.inherits(Stopwatch, events.EventEmitter);

// ---------------------------------------------
// Methods
// ---------------------------------------------
Stopwatch.prototype.start = function(startTime) {
    if (this.interval) {
        return;
    }
    this.startTime = startTime * this.minute || this.startTime;
    this.time = this.startTime;

    // note the use of _.bindAll in the constructor
    // with bindAll we can pass one of our methods to
    // setInterval and have it called with the proper 'this' value
    this.interval = setInterval(this.onTick, this.second);
    this.emit('start:stopwatch');
};

Stopwatch.prototype.stop = function() {
    if (this.interval) {
        clearInterval(this.interval);
        this.interval = undefined;
        this.emit('stop:stopwatch');
    }
};

Stopwatch.prototype.reset = function(restartTime) {
    this.time = (restartTime * this.minute);
    this.emit('reset:stopwatch', this.formatTime(this.time));
};

Stopwatch.prototype.onTick = function() {
    if(this.time > 0){
        this.time -= this.second;       
    }

    var formattedTime = this.formatTime(this.time);
    this.emit('tick:stopwatch', formattedTime);
    
    if (this.time === 0) {
        this.stop();
    }
};

Stopwatch.prototype.formatTime = function(time) {
    var remainder = time,
        numHours,
        numMinutes,
        numSeconds,
        output = "";

    numHours = String(parseInt(remainder / this.hour, 10));
    remainder -= this.hour * numHours;
    
    numMinutes = String(parseInt(remainder / this.minute, 10));
    remainder -= this.minute * numMinutes;
    
    numSeconds = String(parseInt(remainder / this.second, 10));
    
    output = _.map([numHours, numMinutes, numSeconds], function(str) {
        if (str.length === 1) {
            str = "0" + str;
        }
        return str;
    }).join(":");

    return output;
};

Stopwatch.prototype.getTime = function() {
    return this.formatTime(this.time);
};

Stopwatch.prototype.isRunning = function () {
    var isrun = false;
    if(this.interval){
        isrun = true;
    }
    return isrun;
};

// ---------------------------------------------
// Export
// ---------------------------------------------
module.exports = Stopwatch;