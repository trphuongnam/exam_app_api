<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Category;
use App\Models\Answer;

class Selection extends Model
{
    use HasFactory;

    public function user() {
        $this->belongsTo(User::class, 'user_id');
    }

    public function category() {
        $this->belongsTo(Category::class, 'category_id');
    }

    public function answer() {
        $this->belongsTo(Answer::class, 'answer_id');
    }
}
