import React from 'react'
import { Skeleton } from 'primereact/skeleton';
const SkeletonOverlay = () => {
  return (
    <div>
        <div className="border-round border-1 surface-border p-4">
            <div className="mb-2">
                <Skeleton width="100%"  className="mb-2"></Skeleton>
                <Skeleton width="100%"  className="mb-2"></Skeleton>
                <Skeleton width="100%"  className="mb-2"></Skeleton>
                <Skeleton width="100%" height="150px"></Skeleton>
            </div>
        </div>
    </div>
  )
}
export default SkeletonOverlay
