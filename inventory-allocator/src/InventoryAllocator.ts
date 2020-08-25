import { Order, Warehouses, Shipment } from './Types';

type ShipmentIndex = { [warehouse: string]: { [name: string]: number } };

export class InventoryAllocator {

  public allocate(
    order: Order, 
    warehouses: Warehouses
  ): Shipment {
    const shipmentIndex: ShipmentIndex = {};
    const fulfilled: { [item: string]: number } = {};

    // greedily accumulate items from warehouses when available
    for (let [item, count] of Object.entries(order)) {
      for (let { name, inventory } of warehouses) {
        const fulfilledItem = fulfilled[item] || 0
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

    // check that values in fulfilled is same as in order
    for (let key of [...Object.keys(order), ...Object.keys(fulfilled)]) {
      if (order[key] !== fulfilled[key]) {
        return [];
      }
    }

    // convert shipmentIndex to shipment
    const shipment = []
    for (let [warehouse, fulfillment] of Object.entries(shipmentIndex)) {
      shipment.push({ [warehouse]: fulfillment });
    }

    // sort shipment to return warehouse in alphabetical order
    shipment.sort((a, b) => Object.keys(a)[0].charCodeAt(0) - Object.keys(b)[0].charCodeAt(0));
    return shipment;
  }

}
