export const trimSingleObjectValue = (objectInput: object): object => {
  Object.keys(objectInput).forEach((key: string) => {
    if (typeof objectInput[key] === 'string') {
      const value: string = objectInput[key];
      objectInput[key] = value.trim();
    }
  });

  return objectInput;
};
