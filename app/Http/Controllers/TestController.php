<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use App\Models\Results;
use Illuminate\Http\Request;
use App\Traits\ResponseTrait;

class TestController extends Controller
{
    use ResponseTrait;

    public function finishTest(Request $request) {
        try {
            $data = $request->data;
            $category = $request->category;
            $answer_id = [];
            $id_question = [];
            $score = 0;
            $miss = 20 - count($data);

            foreach ($data as $value) {
                array_push($id_question, $value['qId']);

                if (!$value['isMulti']) {
                    array_push($answer_id, $value['answerId'][0]);
                }
            }

            $answers = Answer::whereIn('question_id', $id_question)
                                ->whereIn('id', $answer_id)
                                ->get(['id', 'key', 'question_id', 'name', 'correct']);
            
            foreach ($answers as $ans) {
                if ($ans->correct == 1) {
                    $score = $score + 1;
                }
            }

            $result = new Results();
            $result->user_id = auth()->payload()->get('sub');
            $result->category_id = $category;
            $result->score = $score;
            $result->save();

            $response = [
                'score' => $score,
                'miss' => $miss
            ];
            
            return $this->respondSuccess($response);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
