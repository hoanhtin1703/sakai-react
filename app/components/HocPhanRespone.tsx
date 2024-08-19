import React, { useState, useEffect } from 'react';
import { getDanhMucHocPhan } from '../api/services/moduleService';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { setBreadcrumbs, addBreadcrumb, clearBreadcrumbs,addBreadcrumbIfNotExists } from '@/app/redux/slice/breadcrumbSlice';
import { RootState } from '@/app/lib/store';
import { useSelector, useDispatch } from 'react-redux';

type Props = {
  keyId: string;
};

export const HocPhanRespone = (props: Props) => {
const router =useRouter()
  const breadcrumbs = useSelector((state: RootState) => state.breadcrumb);
  const dispatch = useDispatch();
  const [classMenu, setClassMenu] = useState<any[]>([]);
  const [total, setTotal] = useState<any>(0);

  const handleAddBreadcrumb = (label: string,sku:string) => {
    const newBreadcrumb = { label: label, command: () => console.log(`Navigating to ${sku}`) };
    dispatch(addBreadcrumbIfNotExists(newBreadcrumb));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDanhMucHocPhan(props.keyId);
        setClassMenu(response.data);
        setTotal(response.total);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, [props.keyId]);

  const renderActions = (rowData: any) => {
    return (
      <div className="flex gap-3">
        <Button
          label="Xem danh sách"
          outlined
          severity="info"
          icon="pi pi-list"
          onClick={() => {
            handleAddBreadcrumb(rowData['Lớp học phần'],rowData['sku']);
            // Chuyển hướng đến trang chi tiết với `fileKey` và `sku`
            router.push(`/pages/Khoa/${props.keyId}/${rowData['sku']}`, { shallow: true });
          }}
        />
        <Button
          label="Xuất Excel"
          severity="success"
          icon="pi pi-file-excel"
          onClick={() => {
            // Xử lý khi bấm nút Export
          }}
        />
      </div>
    );
  };

  return (
    <div className="card mt-2">
      <h5>Danh sách học phần</h5>
      <DataTable
        value={classMenu}
        paginator
        className="p-datatable-gridlines"
        showGridlines
        rows={10}
        emptyMessage="Không có dữ liệu"
      >
        <Column field="Lớp học phần" header="Học phần" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
        <Column header="Tác vụ" style={{ flexGrow: 1, flexBasis: '200px' }} body={renderActions}></Column>
      </DataTable>
      <div className="mt-2 border border-blue-500 rounded">
        <p>
          Hiện có <span className="font-bold text-blue-500">{total}</span> Học phần
        </p>
      </div>
    </div>
  );
};
