// Initial state
import {WikipediaState} from "../../types/state.ts";

// Initial state
const initialState: WikipediaState = {
  searchResults: [],
  selectedPage: null,
  selectedTalkPage: null,
  threads: [],
  currentThread: null,
  loading: false,
  error: null
};


export default initialState;