export default class ObjectUtil {

  static isEmpty(obj) {
    if (obj === null || obj === undefined) {
      return true;
    }

    if (Array.isArray(obj)) {
      return obj.length === 0;
    }

    switch (typeof (obj)) {
      case 'object':
        return Object.keys(obj).length === 0;
      case 'string':
        return obj.length === 0;
      case 'number':
        return obj === 0;
      case 'boolean':
      case 'function':
      case 'symbol':
      default:
        return false;
    }
  }
}
