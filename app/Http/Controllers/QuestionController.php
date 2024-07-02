<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use Illuminate\Http\Request;
use App\Models\Question;
use App\Traits\ResponseTrait;
use Illuminate\Support\Facades\DB;
use Importer;

class QuestionController extends Controller
{
    use ResponseTrait;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
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
        DB::beginTransaction();
        try {
            $question = Question::create([
                'name' => $request->name,
                'description' => $request->description ? $request->description : '',
                'category_id' => $request->category_id,
                'multiple' => $request->multiple ? 1 : 2
            ]);

            foreach ($request->answers as $data) {
                Answer::create([
                    'name' => $data['name'],
                    'key' => $data['key'],
                    'correct' => $data['correct'],
                    'question_id' => $question['id']
                ]);
                DB::commit();
            }
            
            DB::commit();
            return $this->respondSuccess(['message' => 'Create question success']);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
            return $this->respondError(500, 'Internal Server Error', ['status' => '500']);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($category)
    {
        print($category);
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function importExcel(Request $request)
    {
        DB::beginTransaction();
        try {
            $excel = Importer::make('Excel');
            $excel->load($request->file);
            $collection = $excel->getCollection();

            foreach ($collection as $key => $row) {
                if ($key > 0) {
                    $arrError = [];
                    if ($row[0] == '' || !$row[0]) {
                        array_push($arrError, [
                            'row' => $key + 1,
                            'message' => 'Question name invalid'
                        ]);
                    }
                    if ($row[2] == '' || !$row[2]) {
                        array_push($arrError, [
                            'row' => $key + 1,
                            'message' => 'CategoryId invalid'
                        ]);
                    }
                    if ($row[3] == '' || !$row[3]) {
                        array_push($arrError, [
                            'row' => $key + 1,
                            'message' => 'Multiple invalid'
                        ]);
                    }
                    if ($row[8] == '' || $row[9] == '' || $row[10] == '' || $row[11] == '') {
                        array_push($arrError, [
                            'row' => $key + 1,
                            'message' => 'Correct answer invalid',
                            'data' => $row[8]
                        ]);
                    }

                    if (count($arrError) > 0) {
                        return $this->respondError(422, 'Data invalid', $arrError);
                    } else {
                        $question = Question::create([
                            'name' => $row[0],
                            'description' => $row[1] ? $row[1] : '',
                            'category_id' => $row[2],
                            'multiple' => $row[3]
                        ]);

                        $indexAnswer = 4;
                        $indexCorrect = 8;
                        for ($i=0; $i < 4; $i++) { 
                            Answer::create([
                                'name' => $row[$indexAnswer],
                                'key' => $collection[0][$indexAnswer],
                                'correct' => $row[$indexCorrect],
                                'question_id' => $question->id,
                            ]);
                            DB::commit();
                            $indexAnswer++;
                            $indexCorrect++;
                        }
                        DB::commit();
                    }
                }
            }
            return $this->respondSuccess(['message' => 'Import question success']);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
            return $this->respondError(500, 'Internal Server Error', ['status' => '500']);
        }
    }

    public function getQuestionByCategory($catId) {
        $questions = Question::inRandomOrder()
                        ->with(['answer' => function ($query) {
                            $query->select('id', 'name', 'question_id');
                        }])
                        ->where('category_id', $catId)
                        ->limit(20)
                        ->get();
        return $this->respondSuccess($questions);
    }
}
