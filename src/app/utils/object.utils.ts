import { QueryDocumentSnapshot } from "@angular/fire/firestore/interfaces";

export default class ObjectUtil {
  static isListFromFirebase(objList: any): boolean {
    if (Array.isArray(objList) && (objList.length > 0)) {
      const obj2: Array<QueryDocumentSnapshot<any>>[] = objList;

      for (const subObjList of objList) {
        for (const subObj of subObjList) {
          if (typeof subObj.data === "function") {
            return true;
          }
        }
      }
    }
    return false;
  }

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
