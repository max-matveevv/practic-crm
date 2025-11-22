<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class UserInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('id')
                    ->label('ID'),
                
                TextEntry::make('name')
                    ->label('Имя'),
                
                TextEntry::make('email')
                    ->label('Email'),
                
                TextEntry::make('created_at')
                    ->label('Создан')
                    ->dateTime(),
                
                TextEntry::make('updated_at')
                    ->label('Обновлен')
                    ->dateTime(),
            ]);
    }
}

