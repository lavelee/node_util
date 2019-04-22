function cacheEach( fn, {timeout_ms = 5 * 1000, async = false} = {}) {
  //fn : return 만드는 함수
  const cache = this._cache = {};
  const timer = this._timer = {};

  const _updateTimeout = (arg) => {
    if (timeout_ms === false) return;
    if (cache[arg] !== undefined){
      clearTimeout(timer[arg]);
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
  if (timeout_ms < 1000) throw "really want to refresh cache less than a second? Comment this line if so.";
  let cache = this._cache = null;
  let timer = this._timer = null;

  const _doRefresh = async () => cache = await refresh();
  _doRefresh(); // the result<Promise> can be used as ready flag.
  if (timeout_ms) setInterval( _doRefresh, timeout_ms);

  return (arg) => (cache) ? cache[arg] : null;
}

module.exports = {
  cacheEach,
  cacheBulk,
};


//simple test and usage
if (require.main === module) {
  const update = () => { 
    console.log("updated");
    return {c1:10, c2:{data:20}}; 
  };
  const fn_cached = cacheBulk(update);
  
  console.log(fn_cached("c1"));
  console.log(fn_cached("c10000"));
  setTimeout(()=>{
    console.log(fn_cached("c1"));
    console.log(fn_cached("c2"));
    console.log(fn_cached("c10000"));
  }, 1000);
}