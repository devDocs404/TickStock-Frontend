import { produce } from 'immer'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

// Define a simplified interface for the store state
interface StoreState {
  portfolioDetails: {
    id: string
    name: string
    description: string
    totalInvested: number
    riskLevel: number
  }
  // Setters for each field
  setField: <T extends keyof StoreState>(key: T, value: StoreState[T]) => void
}

const initialState: Omit<StoreState, 'setField'> = {
  portfolioDetails: {
    id: '',
    name: '',
    description: '',
    totalInvested: 0,
    riskLevel: 0,
  },
}

const usePortfolioStore = create<StoreState>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setField: (key, value) =>
          set(
            produce((draft: StoreState) => {
              draft[key] = value
            }),
          ),
      }),
      {
        name: 'persist-storage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
)

export { usePortfolioStore }
