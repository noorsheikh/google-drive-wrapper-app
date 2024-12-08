const storage: Storage = window.localStorage;

export const setItem = (key: string, value: string): void => {
  storage.setItem(key, value);
};

export const getItem = (key: string): string => {
  return storage.getItem(key) ?? "";
};

export const removeItem = (key: string): void => {
  storage.removeItem(key);
};
