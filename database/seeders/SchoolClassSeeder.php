<?php

namespace Database\Seeders;

use App\Models\SchoolClass;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SchoolClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = [
            ['name' => 'Class 1'],
            ['name' => 'Class 2'],
            ['name' => 'Class 3'],
            ['name' => 'Class 4'],
            ['name' => 'Class 5'],
        ];

        SchoolClass::insert($classes);
    }
}
