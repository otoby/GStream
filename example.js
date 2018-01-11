function FilterBySmile() {}

FilterBySmile.prototype = new PipeOp();
FilterBySmile.prototype.constructor = FilterBySmile;

FilterBySmile.prototype.pipe = function(arr) {
    const ret = [];
    for (var i in arr) {
        var elem = arr[i];
        if (elem.smile) {
            ret.push(elem);
        }
    }

    this.done(ret);
}


function FilterByAge() {}

FilterByAge.prototype = new PipeOp();
FilterByAge.prototype.constructor = FilterByAge;

FilterByAge.prototype.pipe = function(arr) {
    const ret = [];
    for (var i in arr) {
        var elem = arr[i];
        if (elem.age) {
            ret.push(elem);
        }
    }

    this.done(ret);
}



var sampleData = [{
        age: true,
        smile: false
    },
    {
        age: false,
        smile: false
    },
    {
        age: true,
        smile: true
    },
    {
        age: true,
        smile: true
    },
    {
        age: true,
        smile: true
    },
    {
        age: true,
        smile: false
    },
    {
        age: false,
        smile: false
    },
];

var stream = new GStream(sampleData, 1);
stream.add(new FilterByAge())
    .add(new FilterBySmile())
    .exec(function(result) {
        console.log("Hey I got", result);
    });
