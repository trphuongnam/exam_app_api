<?php

namespace App\Http\Controllers;

use App\Models\Results;
use Illuminate\Http\Request;
use App\Models\Question;
use App\Models\Answer;
use App\Traits\ResponseTrait;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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
    public function show($questionId)
    {
        $question = Question::with(['answer' => function ($query) {
            $query->select('id', 'name', 'question_id', 'key', 'correct');
        }])
            ->where('id', $questionId)
            ->get();
        return $this->respondSuccess($question);
    }
    public function showQS(Request $request)
    {

        $question = Question::with([
            'answer' => function ($query) {
                $query->select('id', 'name', 'question_id', 'key', 'correct');
            },
            'category' => function ($query) {
                $query->select('id', 'name');
            }
        ])->get();
        return $this->respondSuccess($question);
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
        DB::beginTransaction();
        try {
            $question = Question::find($id);
            if ($question) {
                $question->name = $request->name;
                $question->description = $request->description ? $request->description : '';
                $question->category_id = $request->category_id;
                $question->multiple = $request->multiple ? 1 : 2;
                $question->save();
            }

            foreach ($request->answers as $value) {
                $answer = Answer::find($value['id']);
                if ($answer) {
                    $answer->name = $value['name'];
                    $answer->key = $value['key'];
                    $answer->correct = $value['correct'];
                    $answer->save();
                }
                DB::commit();
            }
            DB::commit();
            return $this->respondSuccess(['message' => 'Update question success 22222']);
        } catch (\Throwable $th) {
            DB::rollBack();
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
    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $question = Question::find($id);
            if ($question) {
                DB::table('answers')->where('question_id', $question->id)->delete();

                $question->delete();
                DB::commit();
                return response()->json([
                    'success' => true,
                    'data' => [
                        'message' => 'Đã Xóa Question Thành Công'
                    ],
                    'res' => [
                        'status' => '200'
                    ]
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'data' => [
                        'code' => 404,
                        'message' => 'Question Không Tồn Tại!'
                    ],
                    'res' => [
                        'status' => '404'
                    ]
                ]);
            }
        } catch (\Throwable $th) {

            DB::rollBack();
            return response()->json([
                'success' => false,
                'data' => [
                    'code' => 500,
                    'message' => 'Có lỗi xảy ra khi xóa Question!'
                ],
                'res' => [
                    'status' => '500',
                    'error' => $th->getMessage()
                ]
            ]);
        }
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
                        for ($i = 0; $i < 4; $i++) {
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

    public function getQuestionByCategory($catId)
    {
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
