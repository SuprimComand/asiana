export const setLocation = (location) => {
  return {
    type: 'SET_LOCATION',
    payload: location,
  };
};

export const setLoading = (loading) => {
  return { type: 'SET_LOADING', payload: loading };
};
