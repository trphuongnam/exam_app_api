<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Question;
use App\Models\Results;
use App\Models\Selection;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_time',
        'end_time',
        'created_at',
        'updated_at'
    ];

    public function question() {
        $this->hasMany(Question::class, 'category_id');
    }

    public function result() {
        $this->hasMany(Results::class, 'category_id');
    }

    public function selection() {
        $this->hasMany(Selection::class, 'category_id');
    }
}
