import React, { useState, useEffect } from 'react';
import { getDanhMucHocPhan, getHocPhan } from '../api/services/moduleService';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { setBreadcrumbs, addBreadcrumb, clearBreadcrumbs, addBreadcrumbIfNotExists } from '@/app/redux/slice/breadcrumbSlice';
import { RootState } from '@/app/lib/store';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import SkeletonOverlay from './skeleton/SkeletonOverlay';
import { Message } from 'primereact/message';
type Props = {
  keyId: string;
  sku: string;
};

interface HocPhan {
    name: string;
}
export const LopHocPhanRespone = (props: Props) => {
  const router = useRouter();
  const breadcrumbs = useSelector((state: RootState) => state.breadcrumb);
  const dispatch = useDispatch();
  const [classMenu, setClassMenu] = useState<any[]>([]);
  const [total, setTotal] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [hocphan, setHocphan] = useState<HocPhan | undefined>(undefined);
  const handleAddBreadcrumb = (label: string, sku: string) => {
    const newBreadcrumb = { label: label, command: () => console.log(`Navigating to ${sku}`) };
    dispatch(addBreadcrumbIfNotExists(newBreadcrumb));
  };
  const content = (
    <div className="flex align-items-center">
        <div className="ml-2"><p>
              Hiện có <span className="font-bold text-blue-500">{total}</span> lớp học phần
            </p></div>
    </div>
);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHocPhan(props.keyId, props.sku);
        setClassMenu(response.data);
        setTotal(response.total);
        const data_hocphan: HocPhan = {
            name: response.hocphan[0]
        };
        setHocphan(data_hocphan);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [props.keyId, props.sku]);

  const renderActions = (rowData: any) => {
    return (
      <div className="flex gap-3">
        <Button
          label="Xem danh sách"
          outlined
          severity="info"
          icon="pi pi-list"
          onClick={() => {
            handleAddBreadcrumb(rowData['Lớp học phần'], rowData['sku']);
            router.push(`/pages/Khoa/${props.keyId}/${rowData['sku']}/danh-sach-sinh-vien`, { shallow: true });
          }}
        />
      </div>
    );
  };

  return (
    <div className="card mt-2">
   <h5>Danh sách các lớp học phần <span className="font-weight text-blue-500">{hocphan?.name}</span></h5>
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
            <Column field="Lớp học phần" header="Học phần" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
            <Column field="GVHD" header="Giáo Viên Hướng Dẫn" style={{ flexGrow: 1, flexBasis: '200px' }}></Column>
            <Column header="Tác vụ" style={{ flexGrow: 1, flexBasis: '200px' }} body={renderActions}></Column>
          </DataTable>
          <div className="mt-2 border border-blue-500 rounded">
            <Message
                style={{
                    border: 'solid #696cff',
                    borderWidth: '0 0 0 6px',
                }}
                className="border-primary w-full justify-content-start"
                severity="info"
                content={content}
            />

          </div>
        </>
      )}
    </div>
  );
};


