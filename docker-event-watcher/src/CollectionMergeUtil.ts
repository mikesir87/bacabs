
export class CollectionMergeUtil {

  static merge(collectionOne : any[],
               collectionTwo : any[],
               comparator : (a, b) => boolean,
               onNew : (newItem) => void,
               onUpdate : (existingItem, newData) => void,
               onRemoval : (itemRemoved) => void) : void {

    collectionTwo.forEach(item => {
      const matchingItem = collectionOne.find((a) => comparator(a, item));
      if (matchingItem == undefined)
        onNew(item);
      else
        onUpdate(matchingItem, item);
    });

    collectionOne.forEach(item => {
      const matchingItem = collectionTwo.find((b) => comparator(item, b));
      if (matchingItem === undefined)
        onRemoval(item);
    });

  }

}
