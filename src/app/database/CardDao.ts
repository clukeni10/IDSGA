import { CardType } from "../types/CardType"
import IndexedDB from "./IndexedDB"
import { objectStore } from "./IndexedDB/objectStore"

export default class CardDao {

    static shared = new CardDao() 
    private keyPath = objectStore.cardObjectStore

    async addCard(person: CardType): Promise<void> {
        await IndexedDB.shared.addItem<CardType>(person, this.keyPath)
    }

    async generateNextId(): Promise<string> {
        const totalCards = await this.getAllCards();
        const nextId = totalCards.length + 1;
        return nextId.toString().padStart(4, '0');
    }

    async deleteCard(id: string) {
        await IndexedDB.shared.removeItem(id, this.keyPath)
    }

    async updateCard(persons: CardType | CardType[]): Promise<void> {

        if (Array.isArray(persons)) {
            for (const person of persons) {
                await IndexedDB.shared.editItem<CardType>(person, this.keyPath)
            }
        } else {
            await IndexedDB.shared.editItem<CardType>(persons, this.keyPath)
        }
    }

    async getAllCards(): Promise<CardType[]> {
        return await IndexedDB.shared.loadData<CardType>(this.keyPath)
    }
}