export const chunkify = <T>(collection: T[], chunkSize: number): T[][] =>
  collection.reduce(
    (chunks, curr) => {
      const lastChunkIndex = chunks.length - 1;

      if (chunks[lastChunkIndex].length < chunkSize) {
        chunks[lastChunkIndex].push(curr);
        return chunks;
      }

      return chunks.concat([[curr]]);
    },
    [[]] as T[][]
  );
