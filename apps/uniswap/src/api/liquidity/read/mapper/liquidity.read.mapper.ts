import { Injectable } from "@nestjs/common";
import { ILiquidityControllerReadMapper } from "./iliquidity.read.mapper";

@Injectable()
export class LiquidityReadMapper implements ILiquidityControllerReadMapper {}