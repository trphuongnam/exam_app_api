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
Route::post('signup', 'App\Http\Controllers\AuthController@signup');
Route::group(['middleware' => 'apiAuth'], function ($router) {
    Route::post('logout', 'App\Http\Controllers\AuthController@logout');
    
    // User route
    Route::group(['prefix' => 'user'], function ($router) {
        Route::get('/', 'App\Http\Controllers\UserController@index');
        Route::get('/history', 'App\Http\Controllers\UserController@getTestHistory');
        Route::get('/certificate', 'App\Http\Controllers\UserController@exportCertificate');
    });

    // Category route
    Route::group(['prefix' => 'category'], function ($router) {
        Route::get('/', 'App\Http\Controllers\CategoryController@index');
        Route::get('/select', 'App\Http\Controllers\CategoryController@getCategory');
        Route::post('/', 'App\Http\Controllers\CategoryController@store');
        Route::get('/tree', 'App\Http\Controllers\CategoryController@getCategoryTree');
        Route::get('/tree/{catId}', 'App\Http\Controllers\CategoryController@getQuestionByCategory');
        Route::get('/{categoryId}', 'App\Http\Controllers\CategoryController@show');
        Route::put('/{id}', 'App\Http\Controllers\CategoryController@update');
    });

    // Question route
    Route::group(['prefix' => 'question'], function ($router) {
        Route::post('/', 'App\Http\Controllers\QuestionController@store');
        Route::post('/import', 'App\Http\Controllers\QuestionController@importExcel');
        Route::get('/category/{catId}', 'App\Http\Controllers\QuestionController@getQuestionByCategory');
        Route::get('/{questionId}', 'App\Http\Controllers\QuestionController@show');
        Route::put('/{id}', 'App\Http\Controllers\QuestionController@update');
    });

    // Test route
    Route::group(['prefix' => 'test'], function ($router) {
        Route::post('/finish', 'App\Http\Controllers\TestController@finishTest');
    });
});

