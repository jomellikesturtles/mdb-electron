import { QueryDocumentSnapshot } from "@angular/fire/firestore/interfaces";

export default class ObjectUtil {
  static isListFromFirebase(objList: any): boolean {
    if (Array.isArray(objList) && (objList.length > 0)) {
      const obj2: Array<QueryDocumentSnapshot<any>>[] = objList

      for (const subObjList of objList) {
        for (const subObj of subObjList) {
          if (typeof subObj.data === "function") {
            return true
          }
        }
      }
    }
    return false;
  }
  static isListFromIpc(list: any[]): boolean {
    return false;
    // IUserMovieData
  }
}
