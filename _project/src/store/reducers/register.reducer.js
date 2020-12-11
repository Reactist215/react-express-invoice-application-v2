import { registerActions } from '../actions';

const initialState = {
    success: false,
    error: {
        email: null,
        password: null
    }
};

const register = function (state = initialState, action) {
    switch (action.type) {
        case registerActions.REGISTER_SUCCESS:
            {
                return {
                    ...initialState,
                    success: true
                };
            }
        case registerActions.REGISTER_ERROR:
            {
                return {
                    success: false,
                    error: action.payload
                };
            }
        default:
            {
                return state
            }
    }
};

export default register;