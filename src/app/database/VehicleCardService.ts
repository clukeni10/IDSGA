import { VehicleCardType } from "../types/VehicleCardType";
import { VehicleType } from "../types/VehicleType";

export default class VehicleCardService{
    static shared = new VehicleCardService()

    async addCard(vehicle: VehicleType & VehicleCardType, url:string): Promise<void>{
        return new Promise<void>((resolve, reject) => {

        })
    }

    async updateCard(vehicle: VehicleType & VehicleCardType, url:string | null): Promise<void>{
        return new Promise<void>((resolve, reject) => {

        })
}

async getAllCards(url: string): Promise<VehicleCardType[]> {
    return new Promise(async (resolve, reject) => {
        
})

}