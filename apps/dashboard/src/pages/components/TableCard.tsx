import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useAllSwaps } from "../../query/api/uniswap/swap/all";
import { GridHelperFunctions } from "../../utilities/GridHelperFunctions";

function TableCard() {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 1,
    pageSize: 10,
  });

  const { swaps: data, isLoading, pagination } = useAllSwaps(
    1,
    paginationModel.page,
    paginationModel.pageSize
  );

  const columns = GridHelperFunctions.getSwapColumns();

  return (
    <div className="card-container">
      <h2 className="card-title"></h2>
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
