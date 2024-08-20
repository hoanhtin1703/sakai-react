/* eslint-disable @next/next/no-img-element */

import React, { useContext,useState,useEffect } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/app/lib/store';
import { getKhoaSinhVien,KhoaSinhVien,importDanhMucHocPhan } from '@/app/api/services/moduleService';
import { setBreadcrumbs,addBreadcrumb,clearBreadcrumbs,addBreadcrumbIfNotExists } from '@/app/redux/slice/breadcrumbSlice';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';
const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const breadcrumbs = useSelector((state: RootState) => state.breadcrumb)
    const dispatch = useDispatch()
    const [khoaSinhViens, setKhoaSinhViens] = useState<KhoaSinhVien[]>([]);
    const [loading, setLoading] = useState(false);
    const [showKhoaSinhViens, setShowKhoaSinhViens] = useState(false);
    const handleAddBreadcrumb = (label:string,sku:string) => {
        const newBreadcrumb = { label: label, command: () => console.log(`Navigating to ${sku} `) }
        dispatch(addBreadcrumbIfNotExists(newBreadcrumb))
      }
      const handleImportClick = async () => {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.xlsx,.xls';
            input.onchange = async (event) => {
                const file = (event.target as HTMLInputElement).files?.[0];
                if (file) {
                    const filename = file.name;
                    const regex = /KHOA\s\d{2}_HK\S*\sNH\s\d{4}-\d{4}/i;

                    if (!regex.test(filename)) {
                        console.error('Invalid file name format');
                        alert('Tên file phải chứa "KHOA", "HKII", và niên khoá (ví dụ: "2023-2024"). Vui lòng thử lại.');
                        return;
                    }

                    setLoading(true);
                    try {
                        await importDanhMucHocPhan(file);
                        console.log('Import successful');
                        // Cập nhật danh sách khóa sinh viên sau khi import thành công
                        const data = await getKhoaSinhVien();
                        if (data) {
                            setKhoaSinhViens(data.data);
                            setShowKhoaSinhViens(true);
                        }
                    } catch (error) {
                        console.error('Import failed:', error);
                    } finally {
                        setLoading(false);
                    }
                }
            };
            input.click();
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    useEffect(() => {
        // Fetch danh sách khoa sinh viên
        async function fetchKhoaSinhViens() {
            try {
                const data = await getKhoaSinhVien();
                if(data) {
                setKhoaSinhViens(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch Khoa Sinh Vien data:', error);
            }
        }
        fetchKhoaSinhViens();
    }, []);
    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Import File Excel',
            items: [
                {
                    label: 'Import',
                    icon: 'pi pi-fw pi-upload',
                    command: () => handleImportClick()
                }
            ]
        },
        ...(showKhoaSinhViens ? [{
            label: 'DANH SÁCH KHÓA SINH VIÊN',
            items: khoaSinhViens.map((item, index) => ({
                label: `${item.Khoa} - ${item.Hoc_ky}(${item.Nam_hoc})`,
                icon: 'pi pi-fw pi-id-card',
                to: `/pages/Khoa/${item.Url_hoc_phan}/hoc-phan`,
                command: () => handleAddBreadcrumb(`${item.Khoa} - ${item.Hoc_ky}`, item.Url_hoc_phan)
            }))
        }] : [])
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

            </ul>

            {loading &&
            <>
            <div className='mt-2'>

             <Skeleton width="100%"  className="mb-2"></Skeleton>
             <Skeleton width="100%"  className="mb-2"></Skeleton>
             <Skeleton width="100%"  className="mb-2"></Skeleton>
            </div>
            </>
                }

        </MenuProvider>
    );
};

export default AppMenu;
