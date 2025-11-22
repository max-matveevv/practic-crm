<?php

namespace App\Filament\Resources\Projects\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProjectInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Основная информация')
                    ->schema([
                        TextEntry::make('id')
                            ->label('ID'),
                        
                        TextEntry::make('title')
                            ->label('Название'),
                        
                TextEntry::make('description')
                            ->label('Описание')
                    ->placeholder('-')
                    ->columnSpanFull(),
                        
                        TextEntry::make('user.name')
                            ->label('Пользователь'),
                    ]),
                
                Section::make('Доступы')
                    ->schema([
                        TextEntry::make('login')
                            ->label('Логин')
                            ->placeholder('-'),
                        
                        TextEntry::make('password')
                            ->label('Пароль')
                            ->placeholder('••••••••'),
                        
                        TextEntry::make('url')
                            ->label('URL')
                            ->url(fn ($record) => $record->url)
                            ->openUrlInNewTab()
                            ->placeholder('-'),
                        
                TextEntry::make('accesses')
                            ->label('Доступы')
                    ->placeholder('-')
                    ->columnSpanFull(),
                        
                        TextEntry::make('accesses_login')
                            ->label('Логин доступа')
                    ->placeholder('-'),
                        
                        TextEntry::make('accesses_password')
                            ->label('Пароль доступа')
                            ->placeholder('••••••••'),
                    ]),
                
                Section::make('Админ панель')
                    ->schema([
                TextEntry::make('admin_url')
                            ->label('URL админки')
                            ->url(fn ($record) => $record->admin_url)
                            ->openUrlInNewTab()
                    ->placeholder('-'),
                        
                TextEntry::make('admin_login')
                            ->label('Логин админки')
                    ->placeholder('-'),
                        
                        TextEntry::make('admin_password')
                            ->label('Пароль админки')
                            ->placeholder('••••••••'),
                        
                        TextEntry::make('admin_accesses')
                            ->label('Админ доступы')
                            ->placeholder('-')
                            ->columnSpanFull(),
                    ]),
                
                Section::make('SSH доступ')
                    ->schema([
                TextEntry::make('ssh_host')
                            ->label('SSH Host')
                    ->placeholder('-'),
                        
                TextEntry::make('ssh_user')
                            ->label('SSH User')
                    ->placeholder('-'),
                        
                        TextEntry::make('ssh_password')
                            ->label('SSH Password')
                            ->placeholder('••••••••'),
                        
                TextEntry::make('ssh_port')
                            ->label('SSH Port')
                            ->placeholder('-'),
                    ]),
                
                Section::make('Дополнительно')
                    ->schema([
                TextEntry::make('build_commands')
                            ->label('Команды сборки')
                    ->placeholder('-')
                    ->columnSpanFull(),
                        
                TextEntry::make('notes')
                            ->label('Заметки')
                    ->placeholder('-')
                    ->columnSpanFull(),
                        
                        TextEntry::make('created_at')
                            ->label('Создан')
                            ->dateTime(),
                        
                        TextEntry::make('updated_at')
                            ->label('Обновлен')
                            ->dateTime(),
                    ]),
            ]);
    }
}
