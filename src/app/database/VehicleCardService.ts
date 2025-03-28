import { fetch } from '@tauri-apps/plugin-http';
import { VehicleCardType } from "../types/VehicleCardType";
import { VehicleType } from "../types/VehicleType";

export default class VehicleCardService {
    static shared = new VehicleCardService()

    async addCard(vehicle: VehicleType & VehicleCardType, url: string): Promise<void> {
        return new Promise<void>(async(resolve, reject) => {
            try {
                const response = await fetch(`http://${url}/card-vehicle/save`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(vehicle)
                });

                if (!response.ok) {
                    throw new Error(`Erro ao enviar dados: ${response.statusText}`);
                }

                resolve();
            } catch (error) {
                reject(error);
            }

        })
    }

    async updateCard(vehicle: VehicleType & VehicleCardType, url: string | null): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                
    
                const response = await fetch(`http://${url}/card-vehicle/save`, {
                    method: "PUT",
                    body: JSON.stringify(vehicle)
                });
    
                if (!response.ok) {
                    throw new Error(`Erro ao atualizar veículo: ${response.statusText}`);
                }
    
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    

    async getAllCards(url: string): Promise<VehicleCardType[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`http://${url}/card-vehicle/getAll`, {
                    method: "GET",
                });

                const data = await response.json();
                const all: VehicleCardType[] = [];

                for (const d of data) {
                    const card: VehicleCardType = {
                        vehicle: {
                            id: d.id,
                            brand: d.brand,
                            color: d.color,
                            entity: d.entity,
                            licensePlate: d.licensePlate,
                            type: d.type
                        },
                        expiration: new Date(d.expiration),
                        cardNumber: d.cardNumber,
                        permitType: d.permitType ?? "Permanente"
                    };

                    all.push(card)
                }
                resolve(all);
            } catch (error) {
                console.log(error)
                reject(error);
            }
        });
    }
    
}