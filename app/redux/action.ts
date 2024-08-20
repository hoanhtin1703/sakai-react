
import { KhoaSinhVien } from "../api/services/moduleService";
export const setKhoaSinhViens = (data: KhoaSinhVien[]) => ({
    type: 'SET_KHOA_SINH_VIENS',
    payload: data,
});
