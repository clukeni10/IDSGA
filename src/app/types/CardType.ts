import { PersonType } from "./PersonType"
import { VehicleType } from "./VehicleType"

export type CardType = {
    vehicle?: VehicleType
    person: PersonType
    expiration: Date
    cardNumber: string
} 