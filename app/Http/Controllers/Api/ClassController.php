<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classes = SchoolClass::withCount('students')->latest()->get();

        return response()->json($classes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:classes,name',
        ]);

        $class = SchoolClass::create($validated);

        return response()->json([
            'message' => 'Class created successfully.',
            'class' => $class,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SchoolClass $class)
    {
        $class->load('students');

        return response()->json([
            'class' => $class,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SchoolClass $class)
    {
         $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('classes', 'name')->ignore($class->id),
            ],
        ]);

        $class->update($validated);

        return response()->json([
            'message' => 'Class updated successfully.',
            'class' => $class,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SchoolClass $class)
    {
        if($class->students()->exists()) {
            return response()->json([
                'message' => 'Cannot delete class with associated students.'
            ], 422);
        }
        $class->delete();

        return response()->json([
            'message' => 'Class deleted successfully.'
        ]);
    }
}
