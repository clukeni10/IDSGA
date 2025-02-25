import { VehicleType } from "./VehicleType"

export type VehicleCardType = {
    expiration: Date
    cardNumber: string
    entity: VehicleType
}