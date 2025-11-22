<?php

namespace App\Filament\Resources\Tasks\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class TaskInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('id')
                    ->label('ID'),
                
                TextEntry::make('title')
                    ->label('Название'),
                
                TextEntry::make('description')
                    ->label('Описание')
                    ->placeholder('-')
                    ->columnSpanFull(),
                
                TextEntry::make('status')
                    ->label('Статус')
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending' => 'Ожидает',
                        'in_progress' => 'В работе',
                        'completed' => 'Завершена',
                        default => $state,
                    }),
                
                TextEntry::make('project.title')
                    ->label('Проект')
                    ->placeholder('-'),
                
                TextEntry::make('user.name')
                    ->label('Пользователь'),
                
                TextEntry::make('priority')
                    ->label('Приоритет')
                    ->formatStateUsing(fn (int $state): string => match ($state) {
                        1 => 'Низкий',
                        2 => 'Средний',
                        3 => 'Высокий',
                        default => (string) $state,
                    }),
                
                TextEntry::make('images')
                    ->label('Изображения')
                    ->formatStateUsing(fn ($state) => is_array($state) ? implode(', ', $state) : '-')
                    ->placeholder('-')
                    ->columnSpanFull(),
                
                TextEntry::make('created_at')
                    ->label('Создана')
                    ->dateTime(),
                
                TextEntry::make('updated_at')
                    ->label('Обновлена')
                    ->dateTime(),
            ]);
    }
}
