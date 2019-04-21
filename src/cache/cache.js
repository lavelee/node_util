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
  // cache : {arg1: result1, arg2: result2} .. 
  let cache = this._cache = null;
  let timer = this._timer = null;

  const _doRefresh = async ()=> cache = await refresh();
  if (timeout_ms === false) _doRefresh();
  else setInterval( _doRefresh, timeout_ms);

  return (arg) => cache[arg];
}

module.exports = {
  cacheEach,
  cacheBulk,
};