const path = require('path')
const winston = require('winston')

module.exports = class Logger {
    static DEFAULT_SCOPE = 'app'
    #scope

    constructor(scope) {
        this.#scope = Logger.parsePathToScope(scope ? scope : Logger.DEFAULT_SCOPE)
    }

    static parsePathToScope(filepath) {
        if (filepath.indexOf(path.sep) >= 0) {
            filepath = filepath.replace(process.cwd(), '')
            filepath = filepath.replace(`${path.sep}src${path.sep}`, '')
            filepath = filepath.replace(`${path.sep}dist${path.sep}`, '')
            filepath = filepath.replace('.ts', '')
            filepath = filepath.replace('.js', '')
            filepath = filepath.replace(path.sep, ':')
        }
        return filepath
    }

    static paramToString(data) {
        switch (typeof data) {
            case 'undefined':
                return "undefined data"
            case 'object':
                if (data instanceof ReferenceError || data instanceof Error) {
                    data = Logger.referenceErrorToObject(data);
                }
                else {
                    for (let i in data) {
                        if (data[i] instanceof ReferenceError || data[i] instanceof Error) {
                            data[i] = Logger.referenceErrorToObject(data[i]);
                        }
                    }
                }
                return data?.stack ? data?.stack : ' object: ' + JSON.stringify(data);
            case 'string':
                return data
            default:
                return ' other: ' + JSON.stringify(data);
        }
    }

    static referenceErrorToObject(error) {
        let tmpError = {};
        for (let i in error) {
            if (!error.hasOwnProperty(i)) continue;
            tmpError[i] = error[i];
        }
        let attributes = ['message', 'name', 'file', 'lineNumber', 'columnNumber', 'stack'];
        attributes.forEach(function (attr) {
            if (error[attr]) {
                tmpError[attr] = error[attr];
            }
        });
        return tmpError;
    }

    _formatScope() {
        return `[${this.#scope}]`
    }

    _log(level, message, args) {
        if (winston) {
            //convert args to String
            let _args = []
            args.forEach(item => {
                _args.push(Logger.paramToString(item))
            })
            winston[level](`${this._formatScope()} ${message} ${_args.join(' ')}`)
        }
    }

    debug(message, ...args) {
        this._log('debug', message, args)
    }

    info(message, ...args) {
        this._log('info', message, args)
    }

    warn(message, ...args) {
        this._log('warn', message, args)
    }

    error(message, ...args) {
        this._log('error', message, args)
    }
}
