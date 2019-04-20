function cacheEach( fn, {timeout_ms = 5 * 1000, async = false} = {}) {
  //fn : return 만드는 함수
  const cache = this._cache = {};
  const timer = this._timer = {};

  const _updateTimeout = (arg) => {
    if (timeout_ms === false) return;
    if (timer[arg]){
      clearTimeout(timer[arg]);
      delete timer[arg];
      _updateTimeout(arg);
    } else {
      timer[arg] = setTimeout(() => {
        delete cache[arg];
        delete timer[arg];
      }, timeout_ms);
    }
  };
  const fnAsync = async function(arg) {
    _updateTimeout(arg);
    return (cache[arg]) ? cache[arg] : cache[arg] = await fn(arg);
  };
  const fnSync = function(arg) {
    _updateTimeout(arg);
    return (cache[arg]) ? cache[arg] : cache[arg] = fn(arg);
  };
  
  return (async) ? fnAsync : fnSync;
}

function cacheBulk( refresh, {timeout_ms = 5 * 1000} = {} ) {
  //fn : 한번에 모든 데이터를 넣는 함수. 결과는 {a: , b: } ... 이고 함수는 a, b 같은 하나의 key로 결과 조회.
}

module.exports = {
  cacheEachReturn,
  cacheBulkRefresh,
};