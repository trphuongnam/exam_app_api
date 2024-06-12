<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AuthService;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public $auth_service;

    public function __construct(AuthService $authService) {
        $this->auth_service = $authService;
    }

    public function login(Request $request) {
        $email = $request->email;
        $password = $request->password;

        $user = $this->auth_service->handleLogin($email, $password);

        if ($user) {
            $jsonToken = $this->createAccessToken();
            return response()->json([
                'success' => true,
                'access_token' => $jsonToken,
            ], 200);
        }

        return response()->json([
            'success' => false,
            'msg' => 'User Not Found' 
        ], 401);
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
}
