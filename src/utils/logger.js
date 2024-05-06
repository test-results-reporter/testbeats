const { magenta, blue, green, yellow, red, options } = require('../helpers/colors');
const trm = console;

const LEVEL_VERBOSE = 2;
const LEVEL_TRACE = 3;
const LEVEL_DEBUG = 4;
const LEVEL_INFO = 5;
const LEVEL_WARN = 6;
const LEVEL_ERROR = 7;
const LEVEL_SILENT = 8;

/**
 * returns log level value
 * @param {string} level - log level
 */
function getLevelValue(level) {
    const logLevel = level.toUpperCase();
    switch (logLevel) {
        case 'TRACE':
            return LEVEL_TRACE;
        case 'DEBUG':
            return LEVEL_DEBUG;
        case 'INFO':
            return LEVEL_INFO;
        case 'WARN':
            return LEVEL_WARN;
        case 'ERROR':
            return LEVEL_ERROR;
        case 'SILENT':
            return LEVEL_SILENT;
        case 'VERBOSE':
            return LEVEL_VERBOSE;
        default:
            return LEVEL_INFO;
    }
}

class Logger {

    constructor() {
        this.level = process.env.TESTBEATS_LOG_LEVEL || 'INFO';
        this.levelValue = getLevelValue(this.level);
        if (process.env.TESTBEATS_DISABLE_LOG_COLORS === 'true') {
            options.disableColors = true;
        }
    }

    /**
     * sets log level
     * @param {('TRACE'|'DEBUG'|'INFO'|'WARN'|'ERROR')} level - log level
     */
    setLevel(level) {
        this.level = level;
        this.levelValue = getLevelValue(this.level);
    }

    trace(...msg) {
        if (this.levelValue <= LEVEL_TRACE) {
            process.stdout.write(`[${magenta('T')}] `);
            msg.forEach(m => trm.debug(m));
        }
    }

    debug(...msg) {
        if (this.levelValue <= LEVEL_DEBUG) {
            process.stdout.write(`[${blue('D')}] `);
            msg.forEach(m => trm.debug(m));
        }
    }

    info(...msg) {
        if (this.levelValue <= LEVEL_INFO) {
            process.stdout.write(`[${green('I')}] `);
            msg.forEach(m => trm.info(m));
        }
    }

    warn(...msg) {
        if (this.levelValue <= LEVEL_WARN) {
            process.stdout.write(`[${yellow('W')}] `);
            msg.forEach(m => trm.warn(getMessage(m)));
        }
    }

    error(...msg) {
        if (this.levelValue <= LEVEL_ERROR) {
            process.stdout.write(`[${red('E')}] `);
            msg.forEach(m => trm.error(getMessage(m)));
        }
    }

}


function getMessage(msg) {
    try {
        return typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg;
    } catch (_) {
        return msg;
    }
}


module.exports = new Logger();