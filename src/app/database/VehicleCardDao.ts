import { VehicleCardType } from "../types/VehicleCardType";
import IndexedDB from "./IndexedDB";
import { objectStore } from "./IndexedDB/objectStore";

export default class VehicleCardDao {
    
    static shared = new VehicleCardDao();
    private keyPath = objectStore.vehicleCardObjectStore

    async addCard(vehicle: VehicleCardType): Promise<void> {
        await IndexedDB.shared.addItem<VehicleCardType>(vehicle, this.keyPath)
    }

    async generateNextId(): Promise<string> {
        const totalCards = await this.getAllCards();
        const nextId = totalCards.length + 1;
        return nextId.toString().padStart(4, '0');
    }

    async deleteCard(id: string) {
            await IndexedDB.shared.removeItem(id, this.keyPath)
        }
    
        async updateCard(vehicles: VehicleCardType | VehicleCardType[]): Promise<void> {
    
            if (Array.isArray(vehicles)) {
                for (const person of vehicles) {
                    await IndexedDB.shared.editItem<VehicleCardType>(person, this.keyPath)
                }
            } else {
                await IndexedDB.shared.editItem<VehicleCardType>(vehicles, this.keyPath)
            }
        }
    
        async getAllCards(): Promise<VehicleCardType[]> {
            return await IndexedDB.shared.loadData<VehicleCardType>(this.keyPath)
        }
}