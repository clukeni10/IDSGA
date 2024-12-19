import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import SetupService from "../database/SetupService";

const initialState: State = {
    address: null,
    personFunctions: [],
    personEscorts: []
}

interface State {
    address: string | null
    personFunctions: { value: string, label: string }[]
    personEscorts: { value: string, label: string }[]
}

interface Actions {
    saveNetworkAddress: (address: string | null) => void
    savePersonFunction: (value: string, address: string) => Promise<void>
    savePersonEscort: (value: string, address: string) => void
    getPersonFunction: () => void
    getPersonEscort: () => void
}

export const useSetupState = create<Actions & State>()(
    persist(
        (set, get) => ({
            ...initialState,
            saveNetworkAddress: (address: string | null) => {
                if (address) {
                    set(() => ({ address: `${address.replace(':3000', '')}:3000` }))
                } else {
                    set(() => ({ address: null }))
                }
            },
            savePersonFunction: async (value: string, address: string) => {
                await SetupService.shared.savePersonFunction(value, address)
                set((state) => ({
                    personFunctions: [...state.personFunctions, { value, label: value }],
                }));
            },
            savePersonEscort: async (value: string, address: string) => {
                await SetupService.shared.savePersonEscort(value, address)
                set((state) => ({
                    personEscorts: [...state.personEscorts, { value, label: value }],
                }));
            },
            getPersonEscort: async () => {
                const { address } = get()

                if (address) {
                    const response = await SetupService.shared.getAllEscorts(address)
                    set(() => ({ personEscorts: response }));
                }
            },
            getPersonFunction: async () => {
                const { address } = get()

                if (address) {
                    const response = await SetupService.shared.getAllFunctions(address)
                    set(() => ({ personFunctions: response }));
                }
            }
        }),
        {
            name: 'sga-network',
            storage: createJSONStorage(() => localStorage),
            partialize: (persistedState) => ({ address: persistedState.address })
        }
    )
)