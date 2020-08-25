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
});
