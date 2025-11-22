<?php

namespace App\Filament\Resources\Projects\Schemas;

use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Основная информация')
                    ->schema([
                TextInput::make('title')
                            ->label('Название')
                            ->required()
                            ->maxLength(255),
                        
                        Textarea::make('description')
                            ->label('Описание')
                            ->rows(3)
                            ->columnSpanFull(),
                        
                        Select::make('user_id')
                            ->label('Пользователь')
                            ->relationship('user', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                    ]),
                
                Section::make('Доступы')
                    ->schema([
                        TextInput::make('login')
                            ->label('Логин'),
                        
                TextInput::make('password')
                            ->label('Пароль')
                    ->password(),
                        
                TextInput::make('url')
                            ->label('URL')
                            ->url()
                            ->maxLength(255),
                        
                Textarea::make('accesses')
                            ->label('Доступы')
                            ->rows(3)
                    ->columnSpanFull(),
                        
                        TextInput::make('accesses_login')
                            ->label('Логин доступа'),
                        
                        TextInput::make('accesses_password')
                            ->label('Пароль доступа')
                            ->password(),
                    ]),
                
                Section::make('Админ панель')
                    ->schema([
                TextInput::make('admin_url')
                            ->label('URL админки')
                            ->url()
                            ->maxLength(255),
                        
                        TextInput::make('admin_login')
                            ->label('Логин админки'),
                        
                TextInput::make('admin_password')
                            ->label('Пароль админки')
                    ->password(),
                        
                        Textarea::make('admin_accesses')
                            ->label('Админ доступы')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),
                
                Section::make('SSH доступ')
                    ->schema([
                        TextInput::make('ssh_host')
                            ->label('SSH Host'),
                        
                        TextInput::make('ssh_user')
                            ->label('SSH User'),
                        
                TextInput::make('ssh_password')
                            ->label('SSH Password')
                    ->password(),
                        
                TextInput::make('ssh_port')
                            ->label('SSH Port')
                    ->numeric()
                    ->default(22),
                    ]),
                
                Section::make('Дополнительно')
                    ->schema([
                Textarea::make('build_commands')
                            ->label('Команды сборки')
                            ->rows(4)
                            ->helperText('Команды для сборки проекта')
                    ->columnSpanFull(),
                        
                Textarea::make('notes')
                            ->label('Заметки')
                            ->rows(4)
                            ->helperText('Дополнительные заметки и инструкции')
                    ->columnSpanFull(),
                    ]),
            ]);
    }
}
