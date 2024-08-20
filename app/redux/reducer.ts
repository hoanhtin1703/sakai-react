import { KhoaSinhVien } from "../api/services/moduleService";
const initialState: KhoaSinhVien[] = [];

const khoaSinhVienReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'SET_KHOA_SINH_VIENS':
            return action.payload;
        default:
            return state;
    }
};

export default khoaSinhVienReducer;
