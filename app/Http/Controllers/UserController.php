<?php

namespace App\Http\Controllers;

use App\Models\Results;
use Illuminate\Http\Request;
use App\Models\User;
use App\Traits\ResponseTrait;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use ResponseTrait;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $users = User::where('id', auth()->payload()->get('sub'))->get();
            return response()->json([
                'success' => true,
                'data' => $users
            ], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json([
                'success' => false,
                'message' => 'error'
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
{
    DB::beginTransaction();

    try {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed', 
            'age' => 'nullable|integer', 
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->age = $request->age; 
        $user->password = Hash::make($request->password); 
        $user->role = 2;
        $user->save();
        DB::commit();
        return response()->json([
            'success' => true,
            'data' => [
                'message' => 'Người dùng đã được tạo thành công',
                'user' => $user 
            ],
            'res' => [
                'status' => '201'
            ]
        ]);
    } catch (\Throwable $th) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'data' => [
                'code' => 500,
                'message' => 'Có lỗi xảy ra khi tạo người dùng!'
            ],
            'res' => [
                'status' => '500',
                'error' => $th->getMessage() 
            ]
        ]);
    }
}


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
{
    $users = User::all();

    return response()->json($users);
}


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        $user = User::find($id);
        if ($user) {
            $user->name = $request->name;
            $user->email = $request->email;
            $user->age = $request->age;
            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }
            $user->save();
        }
        DB::commit();
        return $this->respondSuccess(['message' => 'Update user success']);
    } catch (\Throwable $th) {
        DB::rollBack();
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
            $user = User::find($id);
            if ($user) {
                DB::table('results')->where('user_id', $user->id)->delete();
                $user->delete();
                DB::commit();
                return response()->json([
                    'success' => true,
                    'data' => [
                        'message' => 'Đã Xóa Người Dùng Thành Công'
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
                        'message' => 'Người Dùng Không Tồn Tại!'
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
                    'message' => 'Có lỗi xảy ra khi xóa người dùng!'
                ],
                'res' => [
                    'status' => '500',
                    'error' => $th->getMessage()  
                ]
            ]);
        }
    }
    

    
    public function getTestHistory(Request $request) {
        $current_page = $request->page ? $request->page : 1;
        $per_page = $request->row ? $request->row : 10;

        $results = Results::join('categories as ctg', function ($join) {
                    $join->on('results.category_id', '=', 'ctg.id');
                })
                ->where('results.user_id', '=', auth()->payload()->get('sub'))
                ->select(
                    'results.id',
                    'results.score',
                    'results.created_at as test_time',
                    'ctg.name as ctg_name',
                    'ctg.description as ctg_desc',
                    'ctg.start_time as ctg_start_time',
                    'ctg.end_time as ctg_end_time'
                )
                ->paginate($per_page);
        
        $total_page = ceil($results->total() / $per_page);
        return $this->respondSuccessPaginate($results, $current_page, $total_page, $results->perPage(), $results->total());
    }

    public function getAllTestHistory(Request $request) {
        $current_page = $request->page ? $request->page : 1;
        $per_page = $request->row ? $request->row : 10;
        $results = Results::join('categories as ctg', 'results.category_id', '=', 'ctg.id')
                ->join('users as u', 'results.user_id', '=', 'u.id')  
                // ->where('results.user_id', '=', auth()->payload()->get('sub'))
                ->select(
                    'results.id',
                    'u.name as user_name',   
                    'results.score',         
                    'results.created_at as test_time', 
                    'ctg.name as ctg_name',  
                    'ctg.start_time',        
                    'ctg.end_time'           
                )
                ->paginate($per_page);
        $total_page = ceil($results->total() / $per_page);
        return response()->json([
            'results' => $results,
            'current_page' => $current_page,
            'total_page' => $total_page,
            'per_page' => $results->perPage(),
            'total' => $results->total()
        ]);
    }
    

    public function exportCertificate() {
        try {
            $users = User::where('id', auth()->payload()->get('sub'))->get();

            $background = 'data:image/jpg' . ';base64,' . base64_encode(Storage::get('public/images/bg.jpg'));
            $lines = 'data:image/png' . ';base64,' . base64_encode(Storage::get('public/images/line.png'));
            $stamp = 'data:image/png' . ';base64,' . base64_encode(Storage::get('public/images/stamp.png'));

            $pdf = Pdf::loadView('pdf.certificate', compact('users', 'background', 'lines', 'stamp'))->setOptions([
                'defaultFont' => 'NotoSansJP',
            ]);
            $save_file = $pdf->save(public_path('sample.pdf'));
            $files = $pdf->download('certificate.pdf');
            if ($save_file) {
                $pdf_file = chunk_split(base64_encode(file_get_contents(public_path('sample.pdf'))));
                return $this->respondSuccess($files);
            } else {
                return $this->respondError(500, 'Download Fail');
            }
        } catch (\Throwable $th) {
            throw $th;
            return $this->respondError(500, 'Download Fail');
        }
    }
}
