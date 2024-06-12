<?php
namespace App\Services;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService {
  public function handleLogin($email, $password) {
    $user_data = User::where('email', $email)->first();
    $result = false;
    if ($user_data && Hash::check($password, $user_data->password)) {
      $result = $user_data;
    }
    return $result;
  }
}

?>