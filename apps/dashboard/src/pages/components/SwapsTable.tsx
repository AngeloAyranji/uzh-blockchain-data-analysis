import { useState } from "react";
import { useAllSwaps } from "../../query/api/uniswap/swap";

function SwapsTable() {
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 5,
  });

  const {
    swaps,
    isLoading,
    pagination,
  } = useAllSwaps(1, paginationModel.page, paginationModel.pageSize);

  return (
    <div>
        
    </div>
  )
}

export default SwapsTable;
