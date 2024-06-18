<?php

namespace App\Traits;

trait ResponseTrait
{
    /**
     * Respond success status
     * @param $data
     * @return json $data
     * **/
    protected function respondSuccess($data)
    {
        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    protected function respondSuccessPaginate($data, $pageCurrent, $totalPage , $pageSize, $total)
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'page_current' => $pageCurrent,
            'page_size' => $pageSize,
            'total_page' => $totalPage,
            'total' => $total
        ]);
    }

    /**
     * Respond error
     * @param $code, $message
     * @return json $data
     * **/
    protected function respondError($code, $message, ?array $res = null)
    {
        return response()->json([
            'success' => false,
            'data' => [
                'code' => $code,
                'message' => $message,
            ],
            'res' => $res
        ], $code);
    }
}
