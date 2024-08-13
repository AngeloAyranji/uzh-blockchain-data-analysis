export class GridHelperFunctions {
    private static transactionHash: any = {
        field: "transactionHash",
        headerName: "Transaction Hash",
        width: 200,
    };

    private static tokenIn: any = {
        field: "tokenInSymbol",
        headerName: "Token In",
        width: 200,
    };

    private static tokenOut: any = {
        field: "tokenOutSymbol",
        headerName: "Token Out",
        width: 200,
    };

    private static amountIn: any = {
        field: "amountIn",
        headerName: "Amount In",
        width: 200,
    };

    private static amountOut: any = {
        field: "amountOut",
        headerName: "Amount Out",
        width: 200,
    };

    private static timestamp: any = {
        field: "swapAt",
        headerName: "Swap At",
        width: 200,
    };

    private static version: any = {
        field: "version",
        headerName: "Version",
        width: 200,
    };

    public static getSwapColumns() {
        return [this.transactionHash, this.tokenIn, this.amountIn, this.tokenOut, this.amountOut, this.version, this.timestamp]
    }

}
