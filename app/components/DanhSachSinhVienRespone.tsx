import React, { useState, useEffect } from 'react';
import { getDanhMucHocPhan, getDanhSachSinhVien } from '../api/services/moduleService';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { setBreadcrumbs, addBreadcrumb, clearBreadcrumbs, addBreadcrumbIfNotExists } from '@/app/redux/slice/breadcrumbSlice';
import { RootState } from '@/app/lib/store';
import { useSelector, useDispatch } from 'react-redux';
import SkeletonOverlay from './skeleton/SkeletonOverlay';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type Props = {
    keyId: string;
    sku: string;
};

interface Total {
    total: string;
    total_bykhoa: string;
}

interface HocPhan {
    name: string;
}

export const DanhSachSinhVienRespone = (props: Props) => {
    const router = useRouter();
    const breadcrumbs = useSelector((state: RootState) => state.breadcrumb);
    const dispatch = useDispatch();
    const [classMenu, setClassMenu] = useState<any[]>([]);
    const [total, setTotal] = useState<Total | undefined>(undefined);
    const [hocphan, setHocphan] = useState<HocPhan | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    const handleAddBreadcrumb = (label: string, sku: string) => {
        const newBreadcrumb = { label: label, command: () => console.log(`Navigating to ${sku}`) };
        dispatch(addBreadcrumbIfNotExists(newBreadcrumb));
    };
    const exportToExcel = () => {
        const filteredData = classMenu.map(({ sku, ...rest }) => rest);

        const exportData = filteredData.map((item, index) => ({
            STT: index + 1,
            ...item,
            'Tổng số sinh viên': index === 0 ? total?.total : '',
            'Tổng số sinh viên theo khóa': index === 0 ? total?.total_bykhoa : ''
        }));

        const headers = ['STT', 'Mã sinh viên', 'Họ và Tên', 'Email','Lớp học phần', 'Nhóm', 'Lần học', 'GVHD', 'Khóa', 'Tổng số sinh viên', 'Tổng số sinh viên theo khóa'];
        const worksheet = XLSX.utils.json_to_sheet(exportData, { header: headers });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachSinhVien');
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const fileName = `DanhSachSinhVien${hocphan?.name || 'Data'}.xlsx`;
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDanhSachSinhVien(props.keyId, props.sku);
                setClassMenu(response.data);
                const data_total: Total = {
                    total: response.total["Tổng số sinh viên"],
                    total_bykhoa: response.total["Tổng số theo khóa"]
                };
                const data_hocphan: HocPhan = {
                    name: response.hocphan[0]
                };
                setTotal(data_total);
                setHocphan(data_hocphan);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [props.keyId, props.sku]);

    return (
        <div className="card mt-2">
            <div className="flex md:justify-between">
                <div>
                    <h5>Danh sách sinh viên học phần <span className="font-weight text-blue-500">{hocphan?.name}</span></h5>
                </div>
                <div className='ml-auto mb-2'>
                    <Button
                        label="Xuất Excel"
                        severity="success"
                        icon="pi pi-file-excel"
                        onClick={exportToExcel}
                    />
                </div>
            </div>

            {loading ? (
                <SkeletonOverlay />
            ) : (
                <>
                    <DataTable
                        value={classMenu}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        emptyMessage="Không có dữ liệu"
                    >
                        <Column
                            header="STT"
                            body={(rowData, { rowIndex }) => rowIndex + 1}
                            style={{ flexGrow: 1, flexBasis: '50px' }}
                        ></Column>
                        <Column field="Mã sinh viên" header="Mã sinh viên" bodyStyle={{color:"#4299e1",fontWeight:"bold"}} style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="Họ và Tên" header="Họ và tên" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="Email" header="Email" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="Nhóm" header="Nhóm" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="Lần học" header="Lần học" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="GVHD" header="GVHD" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                        <Column field="Khóa" header="Khóa" bodyStyle={{color:"#4299e1",fontWeight:"bold"}} style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
                    </DataTable>
                    <div className="mt-2 border border-blue-500 rounded">
                        <p>
                            Hiện có <span className="font-bold text-blue-500">{total?.total}</span> sinh viên
                        </p>
                        <p>
                            Tổng số theo khóa: <span className="font-bold text-blue-500">{total?.total_bykhoa}</span>
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};
