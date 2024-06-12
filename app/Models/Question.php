<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Answer;
use App\Models\Category;

class Question extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'category_id',
        'multiple',
        'created_at',
        'updated_at',
    ];

    public function answer() {
        $this->hasMany(Answer::class, 'question_id');
    }

    public function category() {
        $this->belongsTo(Category::class, 'category_id');
    }
}
