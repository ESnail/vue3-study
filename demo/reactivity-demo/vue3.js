let effective

function effect(fn) {
  effective = fn;
}

function reactive (data) {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  let observed = new Proxy(data, {
    get (target, key, receiver) {
      // 普通写法
      // return target[key];

      // proxy + reflect 反射
      // Reflect 有返回值不报错
      const result = Reflect.get(target, key, receiver);
      // return result;

      // 多层处理
      return typeof result !== 'object' ? result : reactive(result);
    },
    set (target, key, value, receiver) {
      effective(key, value);

      // 普通写法，若设置不成功，没有返回
      // target[key] = value;

      // proxy + reflect
      const result = Reflect.set(target, key, value, receiver);
      return result;
    },
    deleteProperty (target, key) {
      const result = Reflect.defineProperty(target, key);
      return result;
    }
  })

  return observed;
}

export default {
  reactive,
  effect
}