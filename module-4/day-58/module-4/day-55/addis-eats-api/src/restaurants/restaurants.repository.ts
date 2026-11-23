
import { Injectable } from "@nestjs/common";
import { Restaurant } from "./restaurant.types";
import { SEED } from "./restaurants.seed";

// Injection token
export const RESTAURANT_REPOSITORY = Symbol(
  "RESTAURANT_REPOSITORY",
);

// Repository contract
export interface RestaurantRepository {
  all(): Restaurant[];
  byId(id: number): Restaurant | undefined;
  save(r: Restaurant): Restaurant;
}

// In-memory implementation
@Injectable()
export class InMemoryRestaurantRepository
  implements RestaurantRepository
{
  private readonly rows = new Map<number, Restaurant>(
    SEED.map((r) => [r.id, r]),
  );

  all(): Restaurant[] {
    return [...this.rows.values()];
  }

  byId(id: number): Restaurant | undefined {
    return this.rows.get(id);
  }

  save(r: Restaurant): Restaurant {
    this.rows.set(r.id, r);
    return r;
  }
}
