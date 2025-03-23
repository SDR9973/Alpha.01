// src/hooks/useAppSelector.ts
import {useSelector, TypedUseSelectorHook} from 'react-redux';
import type {RootState} from '../../types/state';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default useAppSelector;
