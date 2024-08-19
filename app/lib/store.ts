
import { configureStore } from '@reduxjs/toolkit'
import  BreadcrumbSlice  from '../redux/slice/breadcrumbSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
        breadcrumb: BreadcrumbSlice,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
