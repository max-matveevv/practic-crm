<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadController extends Controller
{
    public function uploadImages(Request $request)
    {
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120' // 5MB max
        ]);

        $uploadedImages = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('task-images', $filename, 'public');
                
                // Используем правильный URL для продакшена
                $url = asset('storage/' . $path);
                
                $uploadedImages[] = [
                    'filename' => $filename,
                    'path' => $path,
                    'url' => $url,
                    'original_name' => $image->getClientOriginalName(),
                    'size' => $image->getSize()
                ];
            }
        }

        return response()->json([
            'images' => $uploadedImages
        ]);
    }
}
