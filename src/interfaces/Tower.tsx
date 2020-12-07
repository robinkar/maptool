export default interface Tower {
  x: number;
  y: number;
  color?: string;
  name: string;
  kingdom: "pirates" | "hots" | "freedom" | "planned";
  ql?: number;
  _id?: string;
  __v?: 0;
  capital: boolean;
  linked: boolean;
  neighbours: Array<Tower>;
}
