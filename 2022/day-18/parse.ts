export type Point3D = {
  x: number;
  y: number;
  z: number;
};

export const parseInput = (lines: string[]): Point3D[] => lines.map(parsePoint);

export const parsePoint = (line: string): Point3D => {
  const [x, y, z] = line.split(",").map((v) => Number(v));
  return {
    x,
    y,
    z,
  };
};

export const unparsePoint = ({ x, y, z }: Point3D): string => `${x},${y},${z}`;
