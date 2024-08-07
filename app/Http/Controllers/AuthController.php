<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;
use Illuminate\Support\Facades\Auth;
use App\Traits\ResponseTrait;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ResponseTrait;
    public $auth_service;

    public function __construct(AuthService $authService) {
        $this->auth_service = $authService;
    }

    public function login(Request $request) {
        try {
            $email = $request->email;
            $password = $request->password;
            $user = $this->auth_service->handleLogin($email, $password);

            if ($user) {
                $jsonToken = $this->createAccessToken();
                return $this->respondSuccess([
                    'success' => true,
                    'access_token' => $jsonToken,
                    'message' => 'Login success',
                    'status' => 200
                ]);
            }

            return $this->respondError(401, 'User Not Found', ['status' => 401]);
        } catch (\Throwable $th) {
            // throw $th;
            return $this->respondError(500, $th, ['status' => 500]);
        }
        
    }

    public function logout() {
        auth()->logout(true);
        return response()->json([
            'success' => true,
            'msg' => '' 
        ]);
    }

    private function createAccessToken() {
        $credentials = request(['email', 'password']);
        $token = auth()->attempt($credentials);

        if (!$token) {
            return false;
        }
        return $token;
    }

    public function signup(SignupRequest $signup) {
        try {
            $user = new User();
            $user->name = $signup->name;
            $user->email = $signup->email;
            $user->password = Hash::make($signup->password);
            $user->age = $signup->age;
            $user->role = 2;
            $user->save();
            return $this->respondSuccess([
                'message' => 'Signup success'
            ]);
        } catch (\Throwable $th) {
            throw $th;
            return $this->respondError(500, 'Error when create user');
        }
    }
}
