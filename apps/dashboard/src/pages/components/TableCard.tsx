import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useAllSwaps } from "../../query/api/uniswap/swap/all";
import { GridHelperFunctions } from "../../utilities/GridHelperFunctions";
import { Input } from "./ui/input";

interface TotalSwapsTableProps {
  title: string;
  startDate?: Date;
  endDate?: Date;
}

function TableCard({ title, endDate, startDate
}: TotalSwapsTableProps) {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [senderAddress, setSenderAddress] = useState<string>("");
  const [poolAddress, setPoolAddress] = useState<string>("");
  const [paginationModel, setPaginationModel] = React.useState({
    page: 1,
    pageSize: 5,
  });

  const { swaps: data, isLoading, pagination, refetchAllSwaps } = useAllSwaps(
    1,
    paginationModel.page,
    paginationModel.pageSize,
    tokenAddress,
    senderAddress,
    poolAddress,
    startDate,
    endDate
  );

  const columns = GridHelperFunctions.getSwapColumns();

  useEffect(() => {
    refetchAllSwaps();
  }, [paginationModel.page]);

  return (
    <div className="card-container">
      <h2 className="card-title">{title}</h2>
      <Input className="my-2" placeholder="Enter Token Address" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} />
      <Input className="my-2" placeholder="Enter Sender Address" value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} />
      <Input className="my-2 mb-4" placeholder="Enter Pool Address" value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} />

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={data ? data : []}
          columns={columns}
          {...data}
          rowCount={pagination?.totalCount}
          loading={isLoading}

          pageSizeOptions={[5]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          getRowId={(row: any) => row.transactionHash}
        />
      </div>
    </div>
  );
}

export default TableCard;
