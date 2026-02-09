import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// --- Types ---
interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  batch: string;
  joinedDate: string;
  status: 'Active' | 'Inactive';
  attendance: number;
}

interface Course {
  id: string;
  name: string;
  instructor: string;
  studentsCount: number;
  duration: string;
  fee: number;
}

interface Batch {
  id: string;
  courseId: string;
  name: string;
  time: string;
  days: string[];
}

interface MenuItem {
  id: 'dashboard' | 'students' | 'courses' | 'schedule' | 'finance';
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-72 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div class="p-6 flex items-center gap-3">
          <div class="bg-indigo-600 p-2 rounded-lg shrink-0">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span class="text-lg font-bold tracking-tight text-slate-800 leading-tight">Modern Study Center</span>
        </div>

        <nav class="flex-1 px-4 space-y-1">
          @for (item of menuItems; track item.id) {
            <button 
              (click)="activeTab.set(item.id)"
              [class]="'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ' + 
                (activeTab() === item.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-100')"
            >
              {{ getIcon(item.icon) }}
              <span>{{ item.label }}</span>
            </button>
          }
        </nav>

        <div class="p-4 mt-auto">
          <div class="bg-indigo-600 rounded-2xl p-4 text-white relative overflow-hidden">
            <div class="relative z-10">
              <p class="text-xs opacity-80">Academic Year</p>
              <p class="text-lg font-bold">2024-2025</p>
              <div class="mt-2 h-1 w-full bg-white/20 rounded-full">
                <div class="h-1 bg-white rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- Mobile Logo (visible only on small screens) -->
            <div class="md:hidden bg-indigo-600 p-1.5 rounded-lg">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 class="text-xl font-semibold capitalize">{{ activeTab() }}</h1>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="relative hidden sm:block">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input type="text" placeholder="Search students, batches..." class="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 w-64 transition-all">
            </div>
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
              AD
            </div>
          </div>
        </header>

        <!-- Content Area -->
        <section class="flex-1 overflow-y-auto p-8">
          
          <!-- DASHBOARD VIEW -->
          @if (activeTab() === 'dashboard') {
            <div class="space-y-8">
              <!-- Stats Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                @for (stat of stats(); track stat.label) {
                  <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start mb-4">
                      <div [class]="'p-3 rounded-xl ' + stat.bgColor">
                        {{ getSvgIcon(stat.icon) }}
                      </div>
                      <span class="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">+{{ stat.growth }}%</span>
                    </div>
                    <p class="text-slate-500 text-sm font-medium">{{ stat.label }}</p>
                    <h3 class="text-2xl font-bold mt-1">{{ stat.value }}</h3>
                  </div>
                }
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Recent Students -->
                <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 class="font-bold text-slate-800">Latest Enrollments</h2>
                    <button class="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="w-full text-left">
                      <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                          <th class="px-6 py-4">Student</th>
                          <th class="px-6 py-4">Grade</th>
                          <th class="px-6 py-4">Status</th>
                          <th class="px-6 py-4">Attendance</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        @for (student of recentStudents(); track student.id) {
                          <tr class="hover:bg-slate-50/50 transition-colors cursor-pointer">
                            <td class="px-6 py-4 flex items-center gap-3">
                              <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[10px]">
                                {{ student.name.charAt(0) }}
                              </div>
                              <div>
                                <div class="text-sm font-semibold text-slate-800">{{ student.name }}</div>
                                <div class="text-xs text-slate-400">{{ student.email }}</div>
                              </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-slate-600 font-medium">{{ student.course }}</td>
                            <td class="px-6 py-4">
                              <span [class]="'text-[10px] px-2 py-1 rounded-full font-bold uppercase ' + 
                                (student.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')">
                                {{ student.status }}
                              </span>
                            </td>
                            <td class="px-6 py-4">
                              <div class="flex items-center gap-2">
                                <div class="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div class="h-full bg-indigo-500" [style.width.%]="student.attendance"></div>
                                </div>
                                <span class="text-xs text-slate-500 font-medium">{{ student.attendance }}%</span>
                              </div>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Upcoming Batches -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div class="p-6 border-b border-slate-100">
                    <h2 class="font-bold text-slate-800">Class Schedule</h2>
                  </div>
                  <div class="p-6 space-y-6 flex-1">
                    @for (batch of batches(); track batch.id) {
                      <div class="flex gap-4 group cursor-pointer">
                        <div class="flex flex-col items-center">
                          <div class="w-1.5 h-1.5 rounded-full bg-indigo-600 mb-1 ring-4 ring-indigo-50"></div>
                          <div class="flex-1 w-px bg-slate-200"></div>
                        </div>
                        <div class="flex-1 pb-4">
                          <p class="text-xs text-indigo-600 font-bold">{{ batch.time }}</p>
                          <h4 class="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{{ batch.name }}</h4>
                          <p class="text-xs text-slate-500 mt-1">Room {{ batch.id === 'b1' ? '101' : '104' }} • {{ batch.days.join(', ') }}</p>
                        </div>
                      </div>
                    }
                    <button class="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium hover:border-indigo-300 hover:text-indigo-500 transition-all">
                      + Add Subject Group
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- STUDENTS VIEW -->
          @if (activeTab() === 'students') {
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div class="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100">
                <div>
                  <h2 class="text-lg font-bold">Student Directory</h2>
                  <p class="text-sm text-slate-500">Modern Study Center Enrollment</p>
                </div>
                <div class="flex gap-3 w-full sm:w-auto">
                  <button class="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
                    New Admission
                  </button>
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                   <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                    <tr>
                      <th class="px-6 py-4">Name</th>
                      <th class="px-6 py-4">Standard</th>
                      <th class="px-6 py-4">Admission Date</th>
                      <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    @for (s of allStudents(); track s.id) {
                      <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-6 py-4">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                              {{ s.name.charAt(0) }}
                            </div>
                            <div>
                              <div class="text-sm font-bold text-slate-800">{{ s.name }}</div>
                              <div class="text-xs text-slate-400">{{ s.email }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="text-sm text-slate-700 font-semibold">{{ s.course }}</div>
                          <div class="text-xs text-slate-400">{{ s.batch }}</div>
                        </td>
                        <td class="px-6 py-4 text-sm text-slate-500">{{ s.joinedDate }}</td>
                        <td class="px-6 py-4 text-right">
                          <button class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- COURSES VIEW -->
          @if (activeTab() === 'courses') {
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (course of courses(); track course.id) {
                <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
                  <div class="h-2 bg-indigo-600"></div>
                  <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                      <div class="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                      </div>
                      <span class="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{{ course.duration }}</span>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">{{ course.name }}</h3>
                    <p class="text-sm text-slate-500 mb-6 italic">Subject Expert: {{ course.instructor }}</p>
                    
                    <div class="flex items-center justify-between py-4 border-t border-slate-100">
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-semibold text-slate-500">{{ course.studentsCount }} Students Enrolled</span>
                      </div>
                      <div class="text-right">
                        <p class="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Annual Fee</p>
                        <p class="text-sm font-bold text-indigo-600">₹{{ (course.fee / 1000).toFixed(1) }}k</p>
                      </div>
                    </div>

                    <button class="w-full mt-2 py-3 bg-slate-50 text-slate-700 font-bold text-sm rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      View Syllabus
                    </button>
                  </div>
                </div>
              }
            </div>
          }

        </section>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  activeTab = signal<'dashboard' | 'students' | 'courses' | 'schedule' | 'finance'>('dashboard');

  menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'students', label: 'Students', icon: 'users' },
    { id: 'courses', label: 'Grades', icon: 'book-open' },
    { id: 'schedule', label: 'Classes', icon: 'calendar' },
    { id: 'finance', label: 'Fees', icon: 'trending-up' },
  ];

  stats = signal([
    { label: 'Total Students', value: '50', growth: 8, icon: 'users', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { label: 'Active Batches', value: '4', growth: 2, icon: 'book-open', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Monthly Collection', value: '₹X.XX', growth: 12, icon: 'trending-up', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Avg Attendance', value: '90%', growth: 4, icon: 'check-circle', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  ]);

  allStudents = signal<Student[]>([
    { id: '1', name: 'Arjun', email: 'arjun.v@demoaccount.com', course: 'Class 10 (High School)', batch: 'Morning Board Prep', joinedDate: '05 Apr 2024', status: 'Active', attendance: 95 },
    { id: '2', name: 'Sara', email: 'sara.k@demoaccount.com', course: 'Class 12 (Intermediate)', batch: 'Physics Group A', joinedDate: '08 Apr 2024', status: 'Active', attendance: 88 },
    { id: '3', name: 'Manish', email: 'manish.r@demoaccount.com', course: 'Class 9', batch: 'Foundation Batch', joinedDate: '10 Apr 2024', status: 'Active', attendance: 91 },
    { id: '4', name: 'Ishita', email: 'ishita.g@demoaccount.com', course: 'Class 11 (Intermediate)', batch: 'Commerce Batch', joinedDate: '12 Apr 2024', status: 'Active', attendance: 84 },
    { id: '5', name: 'Rohan', email: 'rohan.m@demoaccount.com', course: 'Class 10 (High School)', batch: 'Evening Board Prep', joinedDate: '15 Apr 2024', status: 'Active', attendance: 76 },
    { id: '6', name: 'Pooja', email: 'pooja.d@demoaccount.com', course: 'Class 12 (Intermediate)', batch: 'Maths Intensive', joinedDate: '18 Apr 2024', status: 'Active', attendance: 98 },
  ]);

  recentStudents = computed(() => this.allStudents().slice(0, 5));

  courses = signal<Course[]>([
    { id: 'c1', name: 'Class 10 Board Prep', instructor: 'Mr. Q', studentsCount: 120, duration: '1 Year', fee: 1000 },
    { id: 'c2', name: 'Class 12 Physics (Inter)', instructor: 'Dr. P', studentsCount: 85, duration: '1 Year', fee: 2000 },
    { id: 'c3', name: 'Class 12 Maths (Inter)', instructor: 'Mrs. A', studentsCount: 95, duration: '1 Year', fee: 2000 },
    { id: 'c4', name: 'Class 9 Foundation', instructor: 'Mr. B', studentsCount: 110, duration: '1 Year', fee: 5000 },
    { id: 'c5', name: 'Class 11 Commerce', instructor: 'Ms D', studentsCount: 48, duration: '1 Year', fee: 20000 },
  ]);

  batches = signal<Batch[]>([
    { id: 'b1', courseId: 'c1', name: '10th Maths & Science', time: '08:00 AM', days: ['Mon', 'Tue', 'Wed', 'Thu'] },
    { id: 'b2', courseId: 'c2', name: '12th Physics Theory', time: '04:00 PM', days: ['Mon', 'Wed', 'Fri'] },
    { id: 'b3', courseId: 'c3', name: '12th Calculus Special', time: '05:30 PM', days: ['Tue', 'Thu', 'Sat'] },
    { id: 'b4', courseId: 'c4', name: '9th Junior Foundation', time: '03:30 PM', days: ['Mon', 'Wed'] },
  ]);

  getIcon(iconName: string): string {
    const icons: { [key: string]: string } = {
      'layout-dashboard': '📊',
      'users': '👥',
      'book-open': '📖',
      'calendar': '📅',
      'trending-up': '📈',
    };
    return icons[iconName] || '📌';
  }

  getSvgIcon(iconName: string): string {
    // This will be replaced with actual SVG selection logic
    return '';
  }

  ngOnInit() {}
}
