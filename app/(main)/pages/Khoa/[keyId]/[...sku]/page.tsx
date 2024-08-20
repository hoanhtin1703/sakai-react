"use client"
import React, { useState,useEffect } from 'react';
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter,useSearchParams  } from 'next/navigation';
import { HocPhanRespone } from '@/app/components/HocPhanRespone';
import { LopHocPhanRespone } from '@/app/components/LopHocPhanRespone';
import { DanhSachSinhVienRespone } from '@/app/components/DanhSachSinhVienRespone';
import SkeletonOverlay from '@/app/components/skeleton/SkeletonOverlay';

const Khoa = ({ params }: { params: { keyId: string, sku?: string[] } }) => {

    const sku = params.sku || 'hoc-phan'; // Giá trị mặc định nếu không có sku
    const [currentComponent, setCurrentComponent] = useState<JSX.Element | null>(null);
    useEffect(() => {
        if (sku.includes('hoc-phan')) {
            setCurrentComponent(<HocPhanRespone keyId={params.keyId} />);
        } else if (sku.includes('danh-sach-sinh-vien')) {
            setCurrentComponent(<DanhSachSinhVienRespone keyId={params.keyId} sku={sku[0]} />);
        } else {
            setCurrentComponent(<LopHocPhanRespone keyId={params.keyId} sku={sku[0]} />);
        }
    }, [params.keyId, sku]);

    const breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    const breadcrumbItems = [
        { label: `Khóa ${params.keyId}` },
        {
            label: `SKU ${sku}`,
            command: () => {
                setCurrentComponent(
                    sku === 'hoc-phan' ? <HocPhanRespone keyId={params.keyId} /> : <LopHocPhanRespone keyId={params.keyId} sku={sku[0]} />
                );
            }
        }
    ];

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
                    {currentComponent}
                </div>
            </div>
        </div>
    );
}

export default Khoa;
