import { randomUUID } from 'crypto';

let db = new Map();
export const addNew = (item) => {
  const id = randomUUID();
  db.set(id, { ...item, id });
};
export const has = (id) => db.has(id);
export const replace = (id, item) =>
  db.set(id, { ...item, id });
export const getAll = () => Array.from(db.values());
export const clear = () => db.clear();
