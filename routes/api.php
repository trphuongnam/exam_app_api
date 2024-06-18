<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', 'App\Http\Controllers\AuthController@login');
Route::group(['middleware' => 'apiAuth'], function ($router) {
    Route::post('logout', 'App\Http\Controllers\AuthController@logout');
    
    // User route
    Route::group(['prefix' => 'user'], function ($router) {
        Route::get('/', 'App\Http\Controllers\UserController@index');
    });

    // Category route
    Route::group(['prefix' => 'category'], function ($router) {
        Route::get('/', 'App\Http\Controllers\CategoryController@index');
        Route::get('/select', 'App\Http\Controllers\CategoryController@getCategory');
        Route::post('/', 'App\Http\Controllers\CategoryController@store');
    });

    // Question route
    Route::group(['prefix' => 'question'], function ($router) {
        Route::post('/', 'App\Http\Controllers\QuestionController@store');
        Route::post('/import', 'App\Http\Controllers\QuestionController@importExcel');
    });
});

