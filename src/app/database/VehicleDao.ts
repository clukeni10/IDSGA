import { VehicleType } from "../types/VehicleType"
import IndexedDB from "./IndexedDB"
import { objectStore } from "./IndexedDB/objectStore"


export default class VehicleDao {

    static shared = new VehicleDao()
    private keyPath = objectStore.vehicleObjectStore

    async addVehicle(vehicle: VehicleType): Promise<void> {
        await IndexedDB.shared.addItem<VehicleType>(vehicle, this.keyPath)
    }

    async deleteVehicle(id: string){
        await IndexedDB.shared.removeItem(id, this.keyPath)
    }

    async generateNextId(): Promise<string> {
        const totalCards = await this.getAllVehicles();
        const nextId = totalCards.length + 1;
        return nextId.toString().padStart(4, '0');
    }

    async updateVehicle(vehicles: VehicleType | VehicleType[]): Promise<void> {
        if(Array.isArray(vehicles)){
            for(const vehicle of vehicles) {
                await IndexedDB.shared.editItem<VehicleType>(vehicle, this.keyPath)
            }
        } else {
            await IndexedDB.shared.editItem<VehicleType>(vehicles, this.keyPath)
        }
    }

    async getAllVehicles(): Promise<VehicleType[]> {
        return await IndexedDB.shared.loadData<VehicleType>(this.keyPath)
    }
}