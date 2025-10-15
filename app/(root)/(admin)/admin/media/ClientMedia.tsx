"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UploadMedia from "@/components/Application/Admin/UploadMedia";
import MediaData from "@/components/Application/Admin/MediaData";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ADMIN_MEDIA } from "@/routes/AdminPanelRoutes";

export default function ClientMedia() {
  const [deleteType, setDeleteType] = useState<"SD" | "PD">("SD");
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      if (searchParams.get("trashof")) setDeleteType("PD");
      else setDeleteType("SD");
    }
  }, [searchParams]);

  return (
    <>
      {deleteType === "SD" ? (
        <div className="flex items-center gap-4">
          <UploadMedia isMulti={true} />
          <Link href={`${ADMIN_MEDIA}?trashof="media"`}>
            <Button variant="destructive">Trash</Button>
          </Link>
        </div>
      ) : (
        <Link href={ADMIN_MEDIA}>
          <Button>Back to Media</Button>
        </Link>
      )}

      <div className="mt-5">
        <MediaData deleteType={deleteType} />
      </div>
    </>
  );
}
