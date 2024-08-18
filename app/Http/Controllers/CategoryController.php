<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Question;
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
            $categories = Category::withCount('question')->paginate($per_page);
            $total_page = ceil($categories->total() / $per_page);
            return $this->respondSuccessPaginate($categories, $current_page, $total_page, $categories->perPage(), $categories->total());
        } catch (\Throwable $th) {
            throw $th;
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
    public function getQuestionByCategory($catId)
    {
        $questions = Question::where('category_id', $catId)->get()->toArray();
        $result = [];
        foreach ($questions as $key => $value) {
            array_push($result, [
                'id' => $value['id'],
                'title' => $value['name'],
                'key' => 'question_'.$value['id'],
                'isLeaf' => true,
            ]);
        }

        return $this->respondSuccess([
            'message' => 'get question success',
            'data' => $result
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($categoryId)
    {
        $category = Category::where('id', $categoryId)->get();
        return $this->respondSuccess($category);
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
        try {
            $category = Category::find($id);
            if ($category) {
                $category->name = $request->name;
                $category->description = $request->description;
                $category->start_time = $request->start_time;
                $category->end_time = $request->end_time;
                $category->save();
                return $this->respondSuccess(['message' => 'Update category success']);
            }
            return $this->respondSuccess(['message' => 'Couldn\'t find the category !!!']);
        } catch (\Throwable $th) {
            throw $th;
            return $this->respondError(500, 'Internal Server Error', ['status' => '500']);
        }
        
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

    public function getCategoryTree(Request $request)
    {
        try {
            $categories = Category::select('id', 'name')->get()->toArray();
            $result = [];
            
            foreach ($categories as $key => $value) {
                $item = [
                    'id' => $value['id'],
                    'title' => $value['name'],
                    'key' => "category_".$value['id'],
                    'isLeaf' => false,
                    'children' => [],
                ];
                array_push($result, $item);
            }
            return $this->respondSuccess($result);
        } catch (\Throwable $th) {
            throw $th;
            return $this->respondError(500, 'Internal Server Error', ['status' => '500']);
        }
    }
}
