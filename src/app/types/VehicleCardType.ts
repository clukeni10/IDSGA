import { VehicleType } from "./VehicleType"

export type VehicleCardType = {
    
    vehicle: VehicleType
    expiration: Date 
    cardNumber: string
    permitType?: 'P' | 'T'; 
    
} 