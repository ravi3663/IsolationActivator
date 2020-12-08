import { 
	LOGIN_SUCCESS, 
	LOGIN_FAIL,
  LOADING,
  SIGN_USER,
  RESETAUTH,
  SIGN_OUT
} from '../actions/type';

const INITIAL_STATE = {
    user: null,
    error: {},
    loading: false,
    success: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SIGN_USER:
            return { ...state, user: action.payload, success: false, loading: false };
        case LOGIN_SUCCESS:
            return { ...state, user: action.payload, success: true, loading: false };
        case LOGIN_FAIL:
            if (action.payload.user) {
                return { ...state, error: action.payload, user: action.payload.user, loading: false, success: false };
            }else{
                return { ...state, error: action.payload, loading: false, success: false };
            }
        case LOADING:
            return { ...state, loading: action.payload, success: false };
        case RESETAUTH:
            return {...INITIAL_STATE}
        case SIGN_OUT:
            return {...INITIAL_STATE}
        default:
            return state;
    }
};
