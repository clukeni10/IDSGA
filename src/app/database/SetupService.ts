import { fetch } from '@tauri-apps/plugin-http';

export default class SetupService {

    static shared = new SetupService()

    async savePersonFunction(value: string, url: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await fetch(`http://${url}/setup/function/save`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ personFunction: value }),
                });
                resolve()
            } catch (error) {
                reject(error)
                throw new Error("Failed to process payment");
            }
        })
    }

    async saveVehicleFunction(value:string, url:string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await fetch(`https://${url}/card-vehicle/save`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({vehicleFunction: value})
                });
                resolve()
            } catch(error){
                reject(error);
                throw new Error("Failed to process payment");
            }
        })
    }

    async savePersonEscort(value: string, url: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await fetch(`http://${url}/setup/escort/save`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ personEscort: value }),
                });
                resolve()
            } catch (error) {
                reject(error)
                throw new Error("Failed to process payment");
            }
        })
    }
    async savePersonEntity(value: string, url: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await fetch(`http://${url}/setup/entity/save`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: value }),
                });
                resolve()
            } catch (error) {
                reject(error)
                throw new Error("Failed to process payment");
            }
        })
    }

    async getAllFunctions(url: string): Promise<{ value: string, label: string }[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`http://${url}/setup/function/getAll`, {
                    method: "GET",
                });

                const data: { personFunction: string }[] = await response.json()

                const values = data.map(v => {
                    return { value: v.personFunction, label: v.personFunction }
                })

                resolve(values)

            } catch (error) {
                reject(error)
            }
        })
    }

    async getAllVehicles(url: string): Promise<{ value: string, label: string }[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(`http://${url}/card-vehicle/getAll`, {
                    method: "GET",
                });

                const data: {vehicleFunction: string} [] = await response.json()

                const values = data.map(v => {
                    return {value: v.vehicleFunction, label: v.vehicleFunction}
                }) 
                resolve(values)
            }       catch(error){
                reject(error)
            }
    })
    }

    async getAllEscorts(url: string): Promise<{ value: string, label: string }[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`http://${url}/setup/escort/getAll`, {
                    method: "GET",
                });

                const data: { personEscort: string }[] = await response.json()
                const values = data.map(v => {
                    return { value: v.personEscort, label: v.personEscort }
                })

                resolve(values)

            } catch (error) {
                reject(error)
            }
        })
    } 
    async getAllEntity(url: string): Promise<{ value: string, label: string }[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`http://${url}/setup/entity/getAll`, {
                    method: "GET",
                });

                const data: { name: string }[] = await response.json()
                const values = data.map(v => {
                    return { value: v.name, label: v.name }
                })

                resolve(values)

            } catch (error) {
                reject(error)
            }
        })
    }
}