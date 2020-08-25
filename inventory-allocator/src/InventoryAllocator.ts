import { Order, Warehouses, Shipment } from './Types';

type ShipmentIndex = { [warehouse: string]: { [name: string]: number } };

/**
 * Inventory Allocator class has a method that returns a list of warehouses that can fulfill the order
 * @param {Order} order - Set of items in an order
 * @param {Warehouses} warehouses - Array of warehouses
 * @return {Array} - The list of warehouses that fulfill the order
 */

export class InventoryAllocator {
  public allocate(order: Order, warehouses: Warehouses): Shipment {
    const shipmentIndex: ShipmentIndex = {};
    const fulfilled: { [item: string]: number } = {};

    // Greedily accumulate items from warehouses when available
    for (let [item, count] of Object.entries(order)) {
      for (let { name, inventory } of warehouses) {
        const fulfilledItem = fulfilled[item] || 0;

        if (!inventory[item]) break;

        if (fulfilledItem < count) {
          const needsFulfilled = count - fulfilledItem;
          const canBeFulfilled = Math.min(inventory[item], needsFulfilled);

          if (canBeFulfilled > 0) {
            fulfilled[item] = fulfilled[item] || 0;
            shipmentIndex[name] = shipmentIndex[name] || {};
            shipmentIndex[name][item] = shipmentIndex[name][item] || 0;
            fulfilled[item] += canBeFulfilled;
            shipmentIndex[name][item] += canBeFulfilled;
          }
        }
      }
    }

    // Check that values in fulfilled is same as in order
    for (let key of [...Object.keys(order), ...Object.keys(fulfilled)]) {
      if (order[key] !== fulfilled[key]) {
        return [];
      }
    }

    // Convert shipmentIndex to shipment
    const shipment = [];
    for (let [warehouse, fulfillment] of Object.entries(shipmentIndex)) {
      shipment.push({ [warehouse]: fulfillment });
    }

    // Sort shipment to return warehouse in alphabetical order
    shipment.sort((a, b) => {
      const nameA = Object.keys(a)[0].toUpperCase();
      const nameB = Object.keys(b)[0].toUpperCase();
      return nameA.localeCompare(nameB);
    });

    return shipment;
  }
}
