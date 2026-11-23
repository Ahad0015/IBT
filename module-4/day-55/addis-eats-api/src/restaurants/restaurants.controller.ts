
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";

import { RestaurantsService } from "./restaurants.service";
import { Area, Restaurant } from "./restaurant.types";

@Controller("restaurants")
export class RestaurantsController {
  constructor(
    private readonly restaurants: RestaurantsService,
  ) {}

  @Get()
  findAll(@Query("area") area?: Area): Restaurant[] {
    return this.restaurants.findAll(area);
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Restaurant {
    return this.restaurants.findOne(id);
  }
}
