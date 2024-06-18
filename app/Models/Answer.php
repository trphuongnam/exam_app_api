<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use app\Models\Selection;
use App\Models\Question;

class Answer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'key',
        'correct',
        'question_id',
        'created_at',
        'updated_at'
    ];

    public function selections() {
        $this->hasMany(Selection::class, 'answer_id');
    }

    public function question() {
        $this->hasMany(Question::class, 'question_id');
    }
}
