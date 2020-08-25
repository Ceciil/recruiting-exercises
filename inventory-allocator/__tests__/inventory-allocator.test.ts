import { InventoryAllocator } from '../src/InventoryAllocator';
import { Order, Warehouses } from '../src/Types';

describe("InventoryAllocator", () => {
  let allocator: InventoryAllocator;
  
  beforeAll(() => {
    allocator = new InventoryAllocator();
  });

  it("should allocate nothing for no inventory or warehouse", () => {
    const allocation = allocator.allocate({}, []);
    expect(allocation).toEqual([]);
  });

  it("should allocate nothing for no order, but one warehouse", () => {
    const order: Order = {};
    const warehouses: Warehouses = [{name: "foo", inventory: { apple: 1 }}];
    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual([]);
  });

  it("should allocate nothing for one order, but no warehouse", () => {
    const order: Order = { apple: 1 };
    const warehouses: Warehouses = [];
    const allocation = allocator.allocate(order, warehouses);
    expect(allocation).toEqual([]);
  });

});