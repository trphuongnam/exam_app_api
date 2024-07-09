<?php

namespace App\Http\Controllers;

use App\Models\Results;
use Illuminate\Http\Request;
use App\Models\User;
use App\Traits\ResponseTrait;

class UserController extends Controller
{
    use ResponseTrait;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $users = User::where('id', auth()->payload()->get('sub'))->get();
            return response()->json([
                'success' => true,
                'data' => $users
            ], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'success' => false,
                'message' => 'error'
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function getTestHistory(Request $request) {
        $current_page = $request->page ? $request->page : 1;
        $per_page = $request->row ? $request->row : 10;

        $results = Results::join('categories as ctg', function ($join) {
                    $join->on('results.category_id', '=', 'ctg.id');
                })
                ->where('results.user_id', '=', auth()->payload()->get('sub'))
                ->select(
                    'results.id',
                    'results.score',
                    'results.created_at as test_time',
                    'ctg.name as ctg_name',
                    'ctg.description as ctg_desc',
                    'ctg.start_time as ctg_start_time',
                    'ctg.end_time as ctg_end_time'
                )
                ->paginate($per_page);
        
        $total_page = ceil($results->total() / $per_page);
        return $this->respondSuccessPaginate($results, $current_page, $total_page, $results->perPage(), $results->total());
    }
}
