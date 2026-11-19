
import { Module } from "@nestjs/common";
import {
  RestaurantsController,
} from "./restaurants.controller";
import {
  RestaurantsService,
} from "./restaurants.service";
import {
  InMemoryRestaurantRepository,
  RESTAURANT_REPOSITORY,
} from "./restaurants.repository";

@Module({
  controllers: [RestaurantsController],

  providers: [
    RestaurantsService,
    {
      provide: RESTAURANT_REPOSITORY,
      useClass: InMemoryRestaurantRepository,
    },
  ],
})
export class RestaurantsModule {}
