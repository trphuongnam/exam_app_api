<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Category;

class Results extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'score',
        'created_at',
        'updated_at',
    ];

    public function user() {
        $this->belongsTo(User::class, 'user_id');
    }

    public function category() {
        $this->belongsTo(Category::class, 'category_id');
    }
}
