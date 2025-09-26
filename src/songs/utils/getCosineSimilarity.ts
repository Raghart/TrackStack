export const getCosineSimilarity = (
  songVector: number[],
  userVector: number[],
) => {
  const dotProduct = songVector.reduce(
    (sum, songVal, idx) => sum + songVal * userVector[idx],
    0,
  );
  const songMagnitude = Math.sqrt(
    songVector.reduce((sum, songVal) => sum + Math.pow(songVal, 2), 0),
  );
  const userMagnitude = Math.sqrt(
    userVector.reduce((sum, userVal) => sum + Math.pow(userVal, 2), 0),
  );
  return dotProduct / (songMagnitude * userMagnitude);
};
