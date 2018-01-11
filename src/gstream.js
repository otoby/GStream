class PipeOp {
    constructor() {
        this.stream = null;
        this.next = null;
    }

    done(data) {
        const stream = this.stream;

        if (stream.stop) {
            if (stream.stop === true) {
                return stream.doneHandler(stream.processed);
            } else {
                return stream.errorHandler(stream.error);
            }
        }

        if (this.next && data.length) {
            this.next.pipe(data);
        } else {
            stream.processed = stream.processed.concat(data);

            if (stream.cursor >= stream.end) {
                return stream.doneHandler(stream.processed);
            } else {
                const pos = stream.cursor;
                stream.cursor += stream.perIterationSize;
                stream.startOp.pipe(stream.input.slice(pos, pos + stream.perIterationSize));
            }
        }
    }

    pipe(data) {
        return this.done(data);
    }
}

class GStream {
    constructor(input, perIterationSize) {
        this.perIterationSize = perIterationSize || 1;
        this.cursor = this.perIterationSize;
        this.input = input;

        this.end = input.length;
        this.stop = 0;
        this.processed = [];

        this.doneHandler = this.errorHandler = (v) => console.log("Wasted: ", v);

        this.lastOp = null;
        this.startOp = null;
    }

    add(op) {
        if (!(op instanceof PipeOp)) {
            return this;
        }

        op.stream = this;

        if (this.lastOp !== null) {
            this.lastOp.next = op;
        } else {
            this.startOp = op;
        }

        this.lastOp = op;

        return this;
    }

    exec(callback) {
        if (typeof callback === 'function') {
            this.doneHandler = callback;
        }

        if (this.startOp) {
            this.startOp.pipe(this.input.slice(0, this.perIterationSize));
        } else {
            return this.doneHandler(this.input);
        }
    }

    error(callback) {
        if (typeof callback === 'function') {
            this.errorHandler = callback;
        }
        return this;
    }
}


module.exports = {
    GStream: GStream,
    PipeOp: PipeOp
};
