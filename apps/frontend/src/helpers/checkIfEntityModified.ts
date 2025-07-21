import assert from "assert";

export const checkIfEntityModified = (entity: any, modifiedEntity: any): boolean => {
  try {
    assert.deepStrictEqual(entity, modifiedEntity);
    return false;
  } catch (error) {
    return true; 
  }
};