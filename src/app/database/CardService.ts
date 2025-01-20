import { fetch } from '@tauri-apps/plugin-http';
import { CardType } from "../types/CardType";
import { PersonType } from '../types/PersonType';

export default class CardService {

    static shared = new CardService()

    async addCard(person: PersonType & CardType, url: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await fetch(`http://${url}/card/save`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(person),
                });
                resolve()
            } catch (error) {
                reject(error)
                throw new Error("Failed to process payment");
            }
        })
    }

    async getAllCards(url: string): Promise<CardType[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`http://${url}/card/getAll`, {
                    method: "GET",
                });

                const data = await response.json()
                const all: CardType[] = []

                for (const d of data) {
                    const card: CardType = {
                        person: {
                            name: d.person.name,
                            job: d.person.job,
                            id: d.person.id,
                            escort: d.person.escort,
                            entity: d.person?.entity?.name
                        },
                        expiration: d.expiration,
                        cardNumber: d.cardNumber
                    }
                    all.push(card)
                }
                
                resolve(all)

            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }
}