const initialState = {
  activeLocation: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOCATION':
      return {
        ...state,
        activeLocation: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
