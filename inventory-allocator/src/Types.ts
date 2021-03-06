export type Order = {
  [item: string]: number;
};

export type Warehouses = {
  name: string;
  inventory: {
    [item: string]: number;
  };
}[];

export type Shipment = {
  [name: string]: {
    [item: string]: number;
  };
}[];
