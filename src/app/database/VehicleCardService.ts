import { VehicleCardType } from "../types/VehicleCardType";
import { VehicleType } from "../types/VehicleType";


export default class VehicleCardService {

    static shared = new VehicleCardService()

    async addVehicle(vehicle: VehicleType & VehicleCardType): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {

                
                console.log("Enviando veículo:", vehicle);

                const response = await fetch(`http://192.168.3.127:3000/card-vehicle/save`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify(vehicle),
                });

                const responseData = await response.json();
                console.log("Resposta da API:", responseData);

                resolve();
            } catch (error) {
                console.log(error);
                reject(error);
                throw new Error("A operação de gravação falhou");
            }

        });
    }

    async updateVehicle(vehicle: VehicleType & VehicleCardType): Promise<void> {
        try {
            console.log("Atualizando veículo:", vehicle);

            const API_URL = "http://192.168.3.127:3000/card-vehicle/save";


            const response = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(vehicle),
            });

            const responseData = await response.json();
            console.log("Resposta da API:", responseData);
        } catch (error) {
            console.error("Erro ao atualizar o veículo:", error);
            throw new Error("A operação de atualização falhou");
        }
    }


    async getAllCards(): Promise<VehicleCardType[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const endpoint = `http://192.168.3.127:3000/card-vehicle/getAll`;
                console.log("➡️ Fazendo requisição para:", endpoint);

                const response = await fetch(endpoint, { method: "GET" });

                if (!response.ok) {
                    throw new Error("Erro ao buscar cartões");
                }

                const data = await response.json();
                console.log("📩 Dados recebidos:", data);

                const all: VehicleCardType[] = [];

                for (const d of data) {
                     // Verifique o valor recebido
                    const card: VehicleCardType = {
                        vehicle: {
                            id: d.id,
                            entity: d.entity,
                            brand: d.brand,
                            color: d.color,
                            licensePlate: d.licensePlate,
                            type: d.type,
                        },
                        expiration: new Date(d.expiration),
                        cardNumber: d.cardNumber,
                    };
                    all.push(card);
                }
                resolve(all);
            } catch (error) {
                console.error("❌ Erro ao buscar veículos:", error);
                reject(error);
                return [];
            }
        });
    }
}




