<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|max:100',
            'email' => 'required|unique:users|max:100',
            'age' => 'required|numeric',
            'password' => 'required|min:8|max:10',
        ];
    }

    /**
     * Get message validate
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please input your name',
            'name.max' => 'Length of your name is large',
            'email.required' => 'Please input your email',
            'email.unique' => 'Email is used',
            'email.max' => 'Length of your email is large',
            'age.required' => 'Please input your age',
            'age.numeric' => 'Age is not valid',
            'age.min' => 'Age min 18',
            'age.max' => 'Age max 80',
        ];
    }
}
