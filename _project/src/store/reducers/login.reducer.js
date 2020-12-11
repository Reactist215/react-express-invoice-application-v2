import { loginActions } from '../actions';

const initialState = {
    success: false,
    error: {
        username: null,
        password: null
    }
};

const login = function (state = initialState, action) {
    switch (action.type) {
        case loginActions.LOGIN_SUCCESS:
            {
                return {
                    ...initialState,
                    success: true
                };
            }
        case loginActions.LOGIN_ERROR:
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

export default login;