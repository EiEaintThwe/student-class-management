<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = [
            ['name' => 'Mg Mg', 'email' => 'mgmg@example.com', 'phone' => '0912345678', 'class_id' => 1],
            ['name' => 'Aye Aye', 'email' => 'ayeaye@example.com', 'phone' => '0987654321', 'class_id' => 2],
        ];

        Student::insert($students);
    }
}
