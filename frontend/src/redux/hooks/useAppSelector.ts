// src/hooks/useAppSelector.ts
import {useSelector, TypedUseSelectorHook} from 'react-redux';
import type {RootState} from '../../types/state';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default useAppSelector;


// Define selectors at the module level, not inside component functions
export const selectWikipediaResults = createSelector(
    [(state) => state.wikipedia.searchResults],
    (searchResults) => searchResults
);
