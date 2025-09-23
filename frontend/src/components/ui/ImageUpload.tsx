'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { API_BASE_URL } from '@/api/common';

interface UploadedImage {
    filename: string;
    path: string;
    url: string;
    original_name: string;
    size: number;
}

interface ImageUploadProps {
    images: UploadedImage[];
    onImagesChange: (images: UploadedImage[]) => void;
    maxImages?: number;
    maxSize?: number; // в MB
}

export function ImageUpload({ images, onImagesChange, maxImages = 10, maxSize = 5 }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setError('');
        setUploading(true);

        try {
            // Проверка количества изображений
            if (images.length + files.length > maxImages) {
                throw new Error(`Максимум ${maxImages} изображений`);
            }

            // Проверка размера файлов
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.size > maxSize * 1024 * 1024) {
                    throw new Error(`Файл "${file.name}" слишком большой. Максимум ${maxSize}MB`);
                }
            }

            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('images[]', file);
            });

            const response = await fetch(`${API_BASE_URL}/upload/images`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Ошибка загрузки изображений: ${response.status}`);
            }

            const data = await response.json();
            onImagesChange([...images, ...data.images]);

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки изображений');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-white mb-2">
                    Изображения ({images.length}/{maxImages})
                </label>
                
                <div className="flex gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        loading={uploading}
                        disabled={images.length >= maxImages}
                    >
                        {uploading ? 'Загрузка...' : 'Добавить изображения'}
                    </Button>
                </div>

                {error && (
                    <p className="text-red-400 text-sm mt-2">{error}</p>
                )}

                <p className="text-white/60 text-xs mt-1">
                    Поддерживаются: JPEG, PNG, JPG, GIF, WebP. Максимум {maxSize}MB на файл.
                </p>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <Image
                                src={image.url}
                                alt={image.original_name}
                                width={300}
                                height={128}
                                className="w-full h-32 object-cover rounded-lg border border-white/10"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeImage(index)}
                                    className="opacity-90"
                                >
                                    Удалить
                                </Button>
                            </div>
                            <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs p-1 rounded truncate">
                                {image.original_name} ({formatFileSize(image.size)})
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
