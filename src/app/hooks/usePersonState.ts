import { create } from "zustand";
import PersonDao from "../database/PersonDao";
import { PersonType } from "../types/PersonType";
import CardDao from "../database/CardDao";
import { CardType } from "../types/CardType";
import CardService from "../database/CardService";

const initialState: State = {
    cards: [],
    refresh: 0
}

interface State {
    cards: CardType[]
    refresh: number
}

interface Actions {
    addPerson: (person: PersonType, valid: Date, url: string | null, totalCards?: any[]) => Promise<void>
    forceRefresh: () => void
}

export const usePersonState = create<Actions & State>((set) => ({
    ...initialState,
    addPerson: async (person: PersonType, valid: Date, url: string | null, total?: any[]) => {

        let cardNumber: Promise<string> | string

        if (total) {
            const nextId = total.length + 1;
            cardNumber = nextId.toString().padStart(4, '0');
        } else {
            cardNumber = await CardDao.shared.generateNextId()
        }

        const card: CardType = {
            person: person,
            expiration: valid,
            cardNumber
        }

        if (url) {
            await CardService.shared.addCard({ ...card, ...person }, url)
        } else {

            await PersonDao.shared.addPerson(person)
            await CardDao.shared.addCard(card)
        }

        set((state) => ({ cards: [...state.cards, card], refresh: state.refresh + 1 }))
    },
    forceRefresh: () => {
        set((state) => ({ refresh: state.refresh + 1 }))
    }
}));