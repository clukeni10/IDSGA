import { create } from "zustand";
import { VehicleCardType } from "../types/VehicleCardType";
import { VehicleType } from "../types/VehicleType";
import VehicleDao from "../database/VehicleDao";
import VehicleCardDao from "../database/VehicleCardDao";
import VehicleCardService from "../database/VehicleCardService";


const initialState: State = {
    cards: [],
    refresh: 0
}

interface State {
    cards: VehicleCardType[]
    refresh: number
}

interface Actions {
    addVehicle: (vehicle: VehicleType, valid: Date, url: string | null, totalCards?: any[]) => Promise<void>
    updateVehicle: (vehicle: VehicleType, url: string | null, card: VehicleCardType) => Promise<void>
    forceRefresh: () => void
}

export const useVehicleState = create<Actions & State>((set) => ({
    ...initialState,
    addVehicle: async (vehicle: VehicleType, valid: Date, url: string | null, total?: any[]) => {
        let cardNumber: Promise<string> | string

        if (total) {
            const nextId = total.length + 1;
            cardNumber = nextId.toString().padStart(4, '0');
        } else {
            cardNumber = await VehicleCardDao.shared.generateNextId()
        }

        const card: VehicleCardType = {
            vehicle: vehicle,
            expiration: valid,
            cardNumber,
            permitType: "P"
        }

        if (url) {
            await VehicleCardService.shared.addCard({ ...card, ...vehicle }, url)
        } else {

            await VehicleDao.shared.addVehicle(vehicle)
            await VehicleCardDao.shared.addCard(card)
        }

        set((state) => ({ cards: [...state.cards, card], refresh: state.refresh + 1 }))
    },
    updateVehicle: async (vehicle: VehicleType, url: string | null, card: VehicleCardType) => {
        await VehicleCardService.shared.updateCard({ ...vehicle, ...card }, url)
        set((state) => ({ refresh: state.refresh + 1 }))
    },
    forceRefresh: () => {
        set((state) => ({ refresh: state.refresh + 1 }))
    }

}));