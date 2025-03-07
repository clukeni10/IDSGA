import { VehicleCardType } from "../types/VehicleCardType";
import { VehicleType } from "../types/VehicleType";

export default class VehicleCardService {

    static shared = new VehicleCardService()

    async addVehicle(vehicle: VehicleType & VehicleCardType, url: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {

                console.log("Enviando veículo:", vehicle);

                const response = await fetch(`http://${url}/card-vehicle/save`, {
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

    async updateVehicle(vehicle: VehicleType & VehicleCardType, url: string | null): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {

                console.log("Atualizando veículo:", vehicle);

                const response = await fetch(`http://${url}/card-vehicle/save`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                    body: JSON.stringify(vehicle),
                });
                const responseData = await response.json();
                console.log("Resposta da API:", responseData);

                resolve()
            } catch (error) {
                reject(error)
                throw new Error("A operação de actualização falhou");
            }
        })
    }

    async getAllCards(url: string): Promise<VehicleCardType[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const endpoint = `http://${url}/card-vehicle/getAll`;
                console.log("➡️ Fazendo requisição para:", endpoint);
    
                const response = await fetch(endpoint, { method: "GET" });

    
                console.log("Resposta recebida:", response);
    
                const data = await response.json();
                console.log("📩 Dados recebidos:", data);
    
                const dataArray = Array.isArray(data) ? data : [data]; // Garante que seja um array
                console.log(`📦 Total de itens recebidos: ${dataArray.length}`);

                if (!data || data.length === 0) {
                    console.error("❌ Nenhum dado recebido ou resposta inválida:", data);
                    resolve([]); // Retorna um array vazio para evitar erro
                    return;
                }
                
                const all: VehicleCardType[] = [];
    
                for (const d of dataArray) {
                  
    
                    console.log(`✅ Processando veículo ID: ${d.vehicle.id}`);
    
                    const card: VehicleCardType = {
                        vehicle: {
                            id: d.vehicle.id,
                            entity: d.vehicle.entity ?? "Desconhecida",
                            brand: d.vehicle.brand ?? "Não especificada",
                            color: d.vehicle.color ?? "Não especificada",
                            licensePlate: d.vehicle.licensePlate ?? "Sem placa",
                            type: d.vehicle.type ?? "Desconhecido",
                        },
                        expiration: d.expiration ? new Date(d.expiration) : new Date(),
                        cardNumber: d.cardNumber || "0000",
                    };
    
                    console.log("📌 Adicionando ao array:", card);
                    all.push(card);
                }
    
                console.log("✅ Todos os cartões foram processados.");
                resolve(all);
            } catch (error) {
                console.log("❌ Erro na requisição:", error);
                reject(error);
            }
        });
    }
    
    


}