import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/redux/store'

/**
 * Hook personalizado para usar el dispatch con el tipo AppDispatch en toda la aplicación.
 * Evita el uso directo de `useDispatch` sin tipar.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

/**
 * Hook personalizado para usar el selector con el tipo RootState en toda la aplicación.
 * Evita el uso directo de `useSelector` sin tipar.
 */
export const useAppSelector = useSelector.withTypes<RootState>()
