<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{

    public function createUser(Request $request)
    {
        try {
            $validateUser = Validator::make(
                $request->all(),
                [
                    "name" => "required",
                    "email" => "required|email|unique:users,email",
                    "password" => "required|string|min:8",
                ]
            );

            if ($validateUser->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }


            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'user',
            ]);

            return response()->json([
                'status' => true,
                'message' => 'User Created Successfully',
                'token' => $user->createToken('API TOLEN')->plainTextToken
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }



    /**
     * Store a newly created resource in storage.
     */
    public function loginUser(Request $request)
    {
        try {
            $validateUser = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required'
            ]);

            if ($validateUser->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email and Password does not match with our record.',
                ], 401);
            }

            $user = User::where('email', $request->email)->first();
            return response()->json([
                'status' => true,
                'message' => 'User Logged in Successfully',
                'token' => $user->createToken('API TOKEN')->plainTextToken
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
