import { fetch } from '@tauri-apps/plugin-http';
import { CardType } from "../types/CardType";
import { PersonType } from '../types/PersonType';
import { Buffer } from "buffer" 

export default class CardService {

    static shared = new CardService()

    async addCard(person: PersonType & CardType, file: File | null, url: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {

                const formData = new FormData();

                formData.append("name", person.name);
                formData.append("job", person.job);
                formData.append("escort", person.escort);
                formData.append("entity", person.entity);
                formData.append("cardNumber", person.cardNumber)
                formData.append("expiration", person.expiration.toISOString())
                formData.append("accessType", JSON.stringify(person.accessType));

                if (file) {
                    formData.append("image", file);
                }


                await fetch(`http://${url}/card/save`, {
                    method: "POST",
                    body: formData,
                });
                resolve()
            } catch (error) {
                reject(error)
                throw new Error("A operação de gravação falhou");
            }
        })
    }

    async updateCard(person: PersonType & CardType, file: File | undefined, url: string | null): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {

                const formData = new FormData();

                formData.append("name", person.name);
                formData.append("job", person.job);
                formData.append("personId", person.id);
                formData.append("escort", person.escort);
                formData.append("entity", person.entity);
                formData.append("cardNumber", person.cardNumber)
                formData.append("expiration", person.expiration.toISOString())
                formData.append("accessType", JSON.stringify(person.accessType));

                if (file) {
                    formData.append("image", file);
                }
                
                await fetch(`http://${url}/card/save`, {
                    method: "PUT",
                    body: formData,
                });
                resolve()
            } catch (error) {
                reject(error)
                throw new Error("A operação de actualização falhou");
            }
        })
    }


    async getAllCards(url: string): Promise<CardType[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`http://${url}/card/getAll`, {
                    method: "GET",
                });
    
                const data = await response.json();
                const all: CardType[] = [];
    
                for (const d of data) {
                    let imageBase64 = null;
    
                    // Se existir uma imagem, faz o download e converte para Base64
                    if (d.person.image) {
                        try {
                            const imageResponse = await fetch(`http://${url}/${d.person.image}`);
                            const imageBuffer = await imageResponse.arrayBuffer();
                            
                            imageBase64 = `data:image/png;base64,${Buffer.from(imageBuffer).toString("base64")}`;
                        } catch (imageError) {
                            console.error("Erro ao carregar imagem:", imageError);
                        } 
                    }
    
                    const card: CardType = {
                        person: {
                            name: d.person.name,
                            job: d.person.job,
                            id: d.person.id,
                            escort: d.person.escort,
                            entity: d.person?.entity?.name,
                            accessType: (d.person.permissions as any[]).map(p => p.permission),
                            image: imageBase64 ?? ''
                        },
                        expiration: new Date(d.expiration),
                        cardNumber: d.cardNumber
                    };
    
                    all.push(card);
                }
    
                resolve(all);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }
}