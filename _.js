function _filter(list, predi) {
    var new_list = [];
    _each(list, function(val){
        if (predi(val)) new_list.push(val);
    });
    return new_list;
}

function _map(list, mapper) {
    var new_list = [];
    _each(list, function(val, key){
        new_list.push(mapper(val, key));
    });
    return new_list;
}
var pairs = _map(function(val, key){
    return [key, val];
});

var _get = _curryr( function(obj, key){
    return obj == null ? undefined : obj[key];
});

function _is_object(obj){
    return typeof obj == 'object' && !!obj;
}

function _keys(obj){
    return _is_object(obj) ? Object.keys(obj) : [];
}

var _length = _get('length');

function _each(list, iter){
    var keys = _keys(list); //배열이 들어와도 뽑히고 아니어도 뽑히게 됨
    for (var i = 0, len = keys.length; i < len; i++){
        iter(list[keys[i]], keys[i]);
    }
}

function _curry(fn) {
    return function (a, b) {
        return arguments.length == 2 ? fn(a, b) : function (b) { return fn(a, b); } 
    }
}

function _curryr(fn) {
    return function(a, b){
        return arguments.length == 2 ? fn(a, b) : function (b) { return fn(b, a); } 
    }
}

// function _get(obj, key){
//     return obj == null ? undefined : obj[key];
// }



var slice = Array.prototype.slice;
function _rest(list, num) {
    return slice.call(list, num || 1); //넘겨 준 값이 없으면 기본값 1
}

function _reduce(list, iter, memo) {
    if (arguments.length == 2) {
        memo = list[0];
        list = _rest(list); //이렇게 처리 첫번째 값이 memo로 갔으므로
    }
    _each(list, function (val) {
        memo = iter(memo, val);
    });
    return memo;
}

function _pipe() {
    var fns = arguments;
    return function(arg){
        return _reduce(fns, function(arg, fn){
            return fn(arg);
        }, arg);
    }
}

function _go(arg){
    var fns = _rest(arguments); //첫번째 값은 값으로 받은 인자이므로 제외
    return _pipe.apply(null, fns)(arg);
}

var _map = _curryr(_map);
var _filter = _curryr(_filter);

var _values = _map(_identity);
function _identity(val) { return val; } ;

function _negate(func) {
    return function (val) {
        return !func(val);
    }
}

function _reject(data, predi) {
    return _filter(data, _negate(predi));
}

var _compact = _filter(_identity);

var _find = _curryr(function(list, predi) {
    var keys = _keys(list); 
    for (var i = 0, len = keys.length; i < len; i++) {
        var val = list[keys[i]];
        if(predi(val)) return val;
    }
});

var _find_index = _curryr(function(list, predi) {
    var keys = _keys(list); 
    for (var i = 0, len = keys.length; i < len; i++) {
        if(predi(list[keys[i]])) return i;
    }
    return -1;
});

function _some(data, predi){
    return _find_index(data, predi || _identity) != -1 ;
}

function _every (data, predi){
    return _find_index(data, _negate(predi || _identity)) == -1;
}

function _min(data) {
    return _reduce(data, function (a, b) {
        return a < b ? a : b;
    })
}

function _max(data) {
    return _reduce(data, function (a, b) {
        return a > b ? a : b;
    })
}

function _min_by(data, iter) {
    return _reduce(data, function (a, b) {
        return iter(a) < iter(b) ? a : b;
    })
}

function _max_by(data, iter) {
    return _reduce(data, function (a, b) {
        return iter(a) > iter(b) ? a : b;
    })
}

function _push(obj, key, val) {
    (obj[key] = obj[key] || []).push(val)
    return obj;
}

var _group_by = _curryr(function (data, iter) {
    return _reduce(data, function (grouped, val) {
        return _push(grouped, iter(val), val);
    }, {});
});

var _inc = function (count, key) {
    count[key] ? count[key]++ : count[key] = 1;
    return count;
}


var _count_by = _curryr(function (data, iter) {
    return _reduce(data, function (count, val) {
        return _inc(count, iter(val));
    }, {})
})
