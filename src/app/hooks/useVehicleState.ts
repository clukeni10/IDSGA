
import CardDao from "../database/CardDao";
import CardService from "../database/CardService";
import { CardType } from "../types/CardType";
import { VehicleCardType } from "../types/VehicleCardType";
import { VehicleType } from "../types/VehicleType";

interface State {
    cards: CardType[]
    refresh: number
}

const initialState: State = {
    cards: [],
    refresh: 0
}

interface Actions {
    addVehicle: (vehicle: VehicleType, valid: Date, url: string | null, imageFile: File | null, totalCards?: any[]) => Promise<void>
    updateVehicle:(vehicle: VehicleType, url: string | null, imageFile: File | undefined, card:CardType) => Promise<void>
    forceRefresh: () => void
}

export const useVehicleState = create<Actions & State>((set) => ({
    ...initialState,
addVehicle: async(vehicle: VehicleType, valid: Date, url: string | null, imageFile: File | null, total?: any[]) => {
    let cardNumber: Promise<string> | string

    if (total){
        const nextId = total.length + 1;
        cardNumber = nextId.toString().padStart(4, '0');
    } else{
        cardNumber = await CardDao.shared.generateNextId()
    }

    const card: VehicleCardType = {
        entity: vehicle,
        expiration: valid,
        cardNumber
    }

    /*if(url){
        await CardService.shared.addCard({...card, ...vehicle}, imageFile, url)
    } else {
        await VehicleDao.shared.addVehicle(vehicle)
        await CardDao.shared.addCard(card)
    }
}
    */
})
)