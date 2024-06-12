<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiAuthenticationMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            $token = $request->bearerToken();
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'msg' => 'Unauthorized'
                ], 401);
            } else {
                $user_id = auth()->payload()->get('sub');
                $exp = auth()->payload()->get('exp');

                $arr_token = explode('.', $token);
                $token_payload = $arr_token[1];
                $token_data = json_decode(base64_decode($token_payload));

                if ($user_id == $token_data->sub) {
                    return $next($request);
                }
                return response()->json([
                    'success' => false,
                    'msg' => 'token_invalid'
                ], 401);
            }
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'msg' => 'token_invalid'
            ], 401);
        }
    }
}
