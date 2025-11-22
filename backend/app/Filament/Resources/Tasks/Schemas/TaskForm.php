<?php

namespace App\Filament\Resources\Tasks\Schemas;

use App\Models\Project;
use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class TaskForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Название')
                    ->required()
                    ->maxLength(255),
                
                Textarea::make('description')
                    ->label('Описание')
                    ->columnSpanFull()
                    ->rows(3),
                
                Select::make('status')
                    ->label('Статус')
                    ->required()
                    ->options([
                        'pending' => 'Ожидает',
                        'in_progress' => 'В работе',
                        'completed' => 'Завершена',
                    ])
                    ->default('pending'),
                
                Select::make('project_id')
                    ->label('Проект')
                    ->relationship('project', 'title')
                    ->searchable()
                    ->preload(),
                
                Select::make('user_id')
                    ->label('Пользователь')
                    ->relationship('user', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),
                
                Select::make('priority')
                    ->label('Приоритет')
                    ->required()
                    ->options([
                        1 => 'Низкий',
                        2 => 'Средний',
                        3 => 'Высокий',
                    ])
                    ->default(1),
                
                Textarea::make('images')
                    ->label('Изображения (JSON массив)')
                    ->columnSpanFull()
                    ->helperText('Массив URL изображений в формате JSON'),
            ]);
    }
}
