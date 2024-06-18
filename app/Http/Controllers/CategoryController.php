<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Traits\ResponseTrait;

class CategoryController extends Controller
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
            $current_page = $request->page;
            $per_page = $request->row;
            $categories = Category::paginate($per_page);
            $total_page = ceil($categories->total() / $per_page);
            return $this->respondSuccessPaginate($categories, $current_page, $total_page, $categories->perPage(), $categories->total());
        } catch (\Throwable $th) {
            //throw $th;
            return $this->respondError(500, 'Internal Server Error', ['status' => '500']);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
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
        try {
            $name = $request->name;
            $description = $request->description;
            $start_time = $request->start_time;
            $end_time = $request->end_time;
            
            $category = new Category();
            $category->name = $name;
            $category->description = $description;
            $category->start_time = $start_time;
            $category->end_time = $end_time;
            $category->save();
            return $this->respondSuccess(['message' => 'Save category success']);
        } catch (\Throwable $th) {
            // throw $th;
            return $this->respondError(500, 'Internal Server Error', ['status' => '500']);
        }
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

    /**
     * Select category for selectbox.
     *
     * @return \Illuminate\Http\Response
     */
    public function getCategory()
    {
        try {
            $categories = Category::select('id', 'name')->get()->toArray();
            return $this->respondSuccess($categories);
        } catch (\Throwable $th) {
            // throw $th;
            return $this->respondError(500, 'Internal Server Error', ['status' => '500']);
        }
    }
}
