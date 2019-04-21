function parseSelector(selector) {
  if (!selector) throw "selector required";
	if (typeof selector !== 'string') throw "Selector should be string";
	return selector.split(".").filter(d=>d);
}
  
function stepInto(obj, arg, force_dig){
	let v = obj[arg];
	if (typeof v === 'object' && v !== null) return v;
	else if (v) throw `key '${arg}' has a value '${v}' - which is not an object`;
	else if (v === undefined) return (force_dig) ? obj[arg] = {} : {};
}

function lastObj(obj, args, force_dig=true){
	if (args.length > 0){
		let inner_obj = stepInto(obj, args.shift(), force_dig);
		return lastObj(inner_obj, args);
	} else {
		return obj;
	}
}


// usage : deepSet( obj, "a.b.c.d", 10)
function deepSet(obj, selector, value){
	if (!value) throw "value required";
	let args = parseSelector(selector);
	let deepest_arg = args.pop();
	lastObj(obj, args)[deepest_arg] = value;
	return obj;
}

// usage : deepGet( obj, "a.b.c.d", 10)
function deepGet(obj, selector){
	let args = parseSelector(selector);
	let deepest_arg = args.pop();
	return lastObj(obj, args, true)[deepest_arg]; 
}

module.exports = {
  deepSet,
  deepGet,
}

if (require.main === module) {
	let a;
	
	a = {};
	deepSet( a, "b.c.d", 10);
	console.log(a);

	a = { b: { c: 20}};
	console.log(deepGet( a, "b.c"));
	console.log(deepGet( a, "b.c.d.e")); // throw
}