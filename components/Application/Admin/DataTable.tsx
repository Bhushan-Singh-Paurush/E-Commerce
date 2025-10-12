import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowSelectionState,
  useMaterialReactTable,
} from "material-react-table";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { deleteMutation } from "@/lib/helperFunction/DeleteMediaFunction";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@/components/ui/button";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { usePathname, useSearchParams } from "next/navigation";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import LoadingGIF from "../LoadingGIF";
import { Chip } from "@mui/material";
import { MdOutlineEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
const DataTable = ({
  deleteUrl,
  fetchUrl,
  editUrl,
  queryKey,
  column=[]
}: {
  deleteUrl: string;
  fetchUrl: string;
  editUrl?: Function;
  queryKey: string;
  column?:MRT_ColumnDef<any>[]
}) => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [deleteType, setDeleteType] = useState<"SD" | "PD">("SD");
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const isTrash = searchParams.get("trash");
   
  useEffect(() => {
    if (isTrash) setDeleteType("PD");
    else setDeleteType("SD");
  }, [isTrash]);

  const { data, isLoading, isError, error } = useInfiniteQuery({
    queryFn: async ({ pageParam }) => {
      const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_URL!);
      url.searchParams.set("page", String(pageParam));
      url.searchParams.set("deleteType", String(deleteType));
      url.searchParams.set("limit", "10");

      const { data: response } = await axios.get(url.toString());
      if (!response.success) throw new Error(response.message);

      return {
        item: response.data.items,
        noOfRows: response.data.noOfRows,
      };
    },
    queryKey: [queryKey, deleteType],
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return undefined;
    },
  });
  
  if(isError)
    console.log(error)
  const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
    
    if(column.length!==0)
      return column;

    if (!data || data.pages.length == 0) return [];

    const sample = data.pages[0].item[0];

    return Object.keys(sample)
      .filter(
        (field) =>
          !["_id", `${deleteType == "PD" ? "" : "deletedAt"}`, "__v"].includes(
            field
          )
      )
      .map((key) => {
        return {
          accessorKey: key,
          header: key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase()),
          size: 200,
          Cell:key==="validity" ? ({cell})=>{
                 const date=new Date(cell.getValue<string>())
                 const isValid=new Date()<date
                 return isValid ? <Chip label={date.toLocaleDateString("en-IN")} color="success" /> : <Chip label={date.toLocaleDateString("en-IN")} color="error" />
          } : undefined
        };
      });
  }, [data,column]);

  const deleteCategory = deleteMutation({ queryKey: queryKey, url: deleteUrl });

  async function deleteHandler({
    deleteType = "SD",
    ids = [],
  }: {
    deleteType: string;
    ids: Array<string>;
  }) {
    deleteCategory.mutate({ ids: ids, deleteType: deleteType });
    setRowSelection({});
  }

  const row = data?.pages?.[0].item || [];

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const handleExportData = () => {
    const fields = Object.keys(rowSelection).length
      ? data?.pages?.[0].item.filter((cat: Record<string, any>) =>
          Object.keys(rowSelection).includes(cat._id)
        )
      : data?.pages?.[0].item;

    const csv = generateCsv(csvConfig)(fields);
    download(csvConfig)(csv);
  };
  const table = useMaterialReactTable({
    columns,
    data: row,
    positionActionsColumn: "last",
    enableRowActions: deleteType === "SD" ? true : false,
    enableColumnOrdering: true,
    enableHiding: true,
    enableRowSelection: true,
    rowCount: data?.pages?.[0].noOfRows,
    paginationDisplayMode: "pages",
    columnFilterDisplayMode: "popover",

    getRowId: (row) => row._id,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      isLoading,
    },
    
    renderRowActionMenuItems: ({ row }) => [
      <MenuItem key="edit">
       { editUrl && <Link href={editUrl(row.original._id)} className=" flex items-center gap-2"><MdOutlineEdit/> Edit</Link>}
      </MenuItem>,
      <MenuItem
        className=" flex items-center gap-2"
        key="delete"
        onClick={() =>
          deleteHandler({ deleteType: deleteType, ids: [row.original._id] })
        }
      >
        <MdDelete/>
        Delete
      </MenuItem>,
    ],
    renderTopToolbarCustomActions: ({ table }) => (
      <div className=" w-full flex justify-between">
        <Button onClick={handleExportData}>
          <FileDownloadIcon />
          Export All Data
        </Button>
        {deleteType == "SD" ? (
          <div className=" flex items-center gap-1">
            <Tooltip title="Recycle Bin">
              <IconButton size="small" className=" w-10">
                <Link href={`${pathName}?trash=1`}>
                  <RecyclingIcon />
                </Link>
              </IconButton>
            </Tooltip>

            <Tooltip title="Move to Trash">
              <IconButton
                size="small"
                className=" w-10"
                disabled={Object.keys(rowSelection).length === 0}
                onClick={() =>
                  deleteHandler({
                    deleteType: deleteType,
                    ids: Object.keys(rowSelection),
                  })
                }
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <div className=" flex items-center gap-1">
            <Tooltip title="Restore">
              <IconButton
                size="small"
                className=" w-10"
                disabled={Object.keys(rowSelection).length === 0}
                onClick={() =>
                  deleteHandler({
                    deleteType: "RSD",
                    ids: Object.keys(rowSelection),
                  })
                }
              >
                <RestoreFromTrashIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Paramanent">
              <IconButton
                size="small"
                className=" w-10"
                disabled={Object.keys(rowSelection).length === 0}
                onClick={() =>
                  deleteHandler({
                    deleteType: deleteType,
                    ids: Object.keys(rowSelection),
                  })
                }
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    ),
  });

  return (
    <>
      {isLoading ? (
        <LoadingGIF/>
      ) : isError ? (
        <div className=" w-full h-full flex items-center justify-center text-red-500">{error.message}</div>
      ) : (
        <MaterialReactTable table={table} />
      )}
    </>
  );
};

export default DataTable;
