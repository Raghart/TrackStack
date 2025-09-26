import { artistDataType } from 'src/types/mockTypes';

export const seedSort = (data: artistDataType) => {
  const raw = `${data.id}-abc123`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash += raw.charCodeAt(i);
  }
  return hash;
};
