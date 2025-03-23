// src/hooks/useAppSelector.ts
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../../types/state';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;