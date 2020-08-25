import { InventoryAllocator } from '../src/InventoryAllocator';
import { Order, Warehouses, Shipment } from '../src/Types';

describe('InventoryAllocator', () => {
  let allocator: InventoryAllocator;

  beforeAll(() => {
    allocator = new InventoryAllocator();
  });

  it('should allocate nothing for no inventory or warehouse', () => {
    const order: Order = {};
    const warehouses: Warehouses = [];
    const expected: Shipment = [];

    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual(expected);
  });

  it('should allocate nothing for no order, but one warehouse', () => {
    const order: Order = {};
    const warehouses: Warehouses = [{ name: 'foo', inventory: { apple: 1 } }];
    const expected: Shipment = [];

    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual(expected);
  });

  it('should allocate nothing for one order, but no warehouse', () => {
    const order: Order = { apple: 1 };
    const warehouses: Warehouses = [];
    const expected: Shipment = [];

    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual(expected);
  });

  it('should allocate one shipment where inventory is matching', () => {
    const order: Order = { apple: 10 };
    const warehouses: Warehouses = [{ name: 'foo', inventory: { apple: 10 } }];
    const expected: Shipment = [
      {
        foo: { apple: 10 },
      },
    ];

    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual(expected);
  });

  it('should allocate one shipment where inventory is in excess', () => {
    const order: Order = { apple: 10 };
    const warehouses: Warehouses = [{ name: 'foo', inventory: { apple: 11 } }];
    const expected: Shipment = [
      {
        foo: { apple: 10 },
      },
    ];

    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual(expected);
  });

  it('should allocate nothing when there is not enough inventory', () => {
    const order: Order = { apple: 10 };
    const warehouses: Warehouses = [{ name: 'foo', inventory: { apple: 9 } }];
    const expected: Shipment = [];

    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual(expected);
  });

  it('should ship one item from multiple warehouses', () => {
    const order: Order = { apple: 10 };
    const warehouses: Warehouses = [
      { name: 'foo', inventory: { apple: 5 } },
      { name: 'bar', inventory: { apple: 6 } },
    ];
    const expected: Shipment = [{ foo: { apple: 5 } }, { bar: { apple: 6 } }];

    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual(expected);
  });

  it('should allocate shipment from first warehouse when inventory in excess', () => {
    const order: Order = { apple: 10 };
    const warehouses: Warehouses = [
      { name: 'foo', inventory: { apple: 10 } },
      { name: 'bar', inventory: { apple: 10 } },
      { name: 'baz', inventory: { apple: 10 } },
    ];
    const expected: Shipment = [
      {
        foo: { apple: 10 },
      },
    ];

    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual(expected);
  });

  it('should allocate shipment from first two warehouse when inventory in excess', () => {
    const order: Order = { apple: 19 };
    const warehouses: Warehouses = [
      { name: 'foo', inventory: { apple: 10 } },
      { name: 'bar', inventory: { apple: 10 } },
      { name: 'baz', inventory: { apple: 10 } },
    ];
    const expected: Shipment = [
      {
        foo: { apple: 10 },
        bar: { apple: 9 },
      },
    ];

    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual(expected);
  });

  it('should allocate shipment from first two warehouse when multiple inventory in excess', () => {
    const order: Order = { apple: 19, pear: 9 };
    const warehouses: Warehouses = [
      { name: 'foo', inventory: { apple: 10, pear: 5 } },
      { name: 'bar', inventory: { apple: 10, pear: 6 } },
      { name: 'baz', inventory: { apple: 10, pear: 7 } },
    ];
    const expected: Shipment = [
      {
        foo: { apple: 10, pear: 5 },
        bar: { apple: 9, pear: 4 },
      },
    ];

    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual(expected);
  });

  it('should allocate nothing when there is a partial', () => {
    const order: Order = { apple: 19, pear: 19 };
    const warehouses: Warehouses = [
      { name: 'foo', inventory: { apple: 10, pear: 5 } },
      { name: 'bar', inventory: { apple: 10, pear: 6 } },
      { name: 'baz', inventory: { apple: 10, pear: 7 } },
    ];
    const expected: Shipment = [];

    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual(expected);
  });

  it('should mutate not mutate input order or warehouse when allocation successful', () => {
    const order: Order = { apple: 19, pear: 9 };
    const warehouses: Warehouses = [
      { name: 'foo', inventory: { apple: 10, pear: 5 } },
      { name: 'bar', inventory: { apple: 10, pear: 6 } },
      { name: 'baz', inventory: { apple: 10, pear: 7 } },
    ];
    const expected: Shipment = [
      {
        foo: { apple: 10, pear: 5 },
        bar: { apple: 9, pear: 4 },
      },
    ];

    const orderClone = JSON.parse(JSON.stringify(order));
    const warehousesClone = JSON.parse(JSON.stringify(warehouses));

    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual(expected);
    expect(orderClone).toEqual(order);
    expect(warehousesClone).toEqual(warehouses);
  });

  it('should not mutate input order or warehouse when allocation not successful', () => {
    const order: Order = { apple: 19, pear: 19 };
    const warehouses: Warehouses = [
      { name: 'foo', inventory: { apple: 10, pear: 5 } },
      { name: 'bar', inventory: { apple: 10, pear: 6 } },
      { name: 'baz', inventory: { apple: 10, pear: 7 } },
    ];
    const expected: Shipment = [];

    const orderClone = JSON.parse(JSON.stringify(order));
    const warehousesClone = JSON.parse(JSON.stringify(warehouses));

    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual(expected);
    expect(orderClone).toEqual(order);
    expect(warehousesClone).toEqual(warehouses);
  });
});
