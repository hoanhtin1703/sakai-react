import { createStore, combineReducers } from 'redux';
import khoaSinhVienReducer from './reducer';

const rootReducer = combineReducers({
    khoaSinhVien: khoaSinhVienReducer,
    // other reducers
});

const store = createStore(rootReducer);

export default store;
