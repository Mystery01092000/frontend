import { describe, expect, it } from "vitest";
import { pruneAreasOptionsEntities } from "../../../../../src/panels/lovelace/strategies/areas/helpers/areas-strategy-helper";

const existing = new Set(["light.kitchen", "light.table", "switch.fan"]);
const exists = (entityId: string) => existing.has(entityId);

describe("pruneAreasOptionsEntities", () => {
  it("removes deleted entities from hidden and order", () => {
    expect(
      pruneAreasOptionsEntities(
        {
          kitchen: {
            card_size: "large",
            groups_options: {
              lights: {
                hidden: ["light.deleted", "light.table"],
                order: ["light.kitchen", "light.deleted", "light.table"],
              },
              others: { order: ["switch.fan"] },
            },
          },
        },
        exists
      )
    ).toEqual({
      kitchen: {
        card_size: "large",
        groups_options: {
          lights: {
            hidden: ["light.table"],
            order: ["light.kitchen", "light.table"],
          },
          others: { order: ["switch.fan"] },
        },
      },
    });
  });

  it("drops lists that only held deleted entities", () => {
    expect(
      pruneAreasOptionsEntities(
        {
          kitchen: {
            groups_options: {
              lights: { hidden: ["light.deleted"], order: ["light.kitchen"] },
            },
          },
        },
        exists
      )
    ).toEqual({
      kitchen: {
        groups_options: { lights: { order: ["light.kitchen"] } },
      },
    });
  });

  it("leaves areas without group options untouched", () => {
    const options = { kitchen: { card_size: "large" as const } };
    expect(pruneAreasOptionsEntities(options, exists)).toEqual(options);
    expect(pruneAreasOptionsEntities(undefined, exists)).toBeUndefined();
  });
});
