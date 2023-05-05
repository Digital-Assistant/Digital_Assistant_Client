import {remove} from "circular-reference-remover";

const getCircularReplacer = () => {
  //form a closure and use this
  //weakset to monitor object reference.
  const seen = new WeakSet();

  //return the replacer function
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const removeCycle = (obj) => {
  //set store
  const set = new WeakSet([obj]);

  //recursively detects and deletes the object references
  (function iterateObj(obj) {
    for (let key in obj) {
      // if the key is not present in prototye chain
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object'){
          // if the set has object reference
          // then delete it
          if (set.has(obj[key])){
            delete obj[key];
          }
          else {
            //store the object reference
            set.add(obj[key]);
            //recursively iterate the next objects
            iterateObj(obj[key]);
          }
        }
      }
    }
  })(obj);
}

export const removeCircularObjects = async (domjson) => {
  /*let cache = [];
  const stringifyNode = JSON.stringify(domjson.node, function (key, value) {
    console.log(key);
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Duplicate reference found, discard key
        return false;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null;
  domjson.node=JSON.parse(stringifyNode);
  return domjson;*/

  /*const stringifyNode = JSON.stringify(domjson.node, getCircularReplacer());
  console.log(stringifyNode);
  domjson.node=JSON.parse(stringifyNode);*/

  domjson.node = await remove(domjson.node);

  return domjson;
}
