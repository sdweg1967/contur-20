// Глобальные переменные
let currentUser = {
    tasks: [],
    goals: [],
    spheres: {},
    financialData: {
        income: [],
        expenses: [],
        investments: [],
        capital: 0,
        wallet: 0
    },
    healthData: {
        activities: [],
        sleep: [],
        nutrition: [],
        metrics: {}
    },
    relationshipsData: {
        people: [],
        events: [],
        gifts: []
    },
    studyData: {
        courses: [],
        books: [],
        skills: []
    },
    careerData: {
        projects: [],
        meetings: [],
        goals: []
    },
    creativityData: {
        projects: [],
        ideas: [],
        materials: []
    },
    travelData: {
        plans: [],
        budget: [],
        routes: []
    },
    restData: {
        hobbies: [],
        relaxation: [],
        entertainment: []
    }
};

let calendar;
let activityChart = null;
let selectedSphere = null;
let currentCalendarView = 'dayGridMonth';

// Сферы жизни
const spheres = [
    { 
        id: 'finance', 
        name: 'Финансы', 
        icon: '💰', 
        color: '#10b981',
        subsections: ['Доходы', 'Расходы', 'Инвестиции', 'Капитал']
    },
    { 
        id: 'health', 
        name: 'Здоровье', 
        icon: '🏃', 
        color: '#f59e0b',
        subsections: ['Активность', 'Сон', 'Питание', 'Метрики']
    },
    { 
        id: 'study', 
        name: 'Учеба', 
        icon: '📚', 
        color: '#3b82f6',
        subsections: ['Курсы', 'Книги', 'Навыки', 'Проекты']
    },
    { 
        id: 'career', 
        name: 'Карьера', 
        icon: '💼', 
        color: '#ef4444',
        subsections: ['Проекты', 'Встречи', 'Цели', 'Навыки']
    },
    { 
        id: 'relationships', 
        name: 'Отношения', 
        icon: '❤️', 
        color: '#ec4899',
        subsections: ['Люди', 'События', 'Подарки', 'Встречи']
    },
    { 
        id: 'creativity', 
        name: 'Творчество', 
        icon: '🎨', 
        color: '#8b5cf6',
        subsections: ['Проекты', 'Идеи', 'Материалы', 'Портфолио']
    },
    { 
        id: 'travel', 
        name: 'Путешествия', 
        icon: '✈️', 
        color: '#06b6d4',
        subsections: ['Планы', 'Бюджет', 'Маршруты', 'Бронирования']
    },
    { 
        id: 'rest', 
        name: 'Отдых', 
        icon: '🎮', 
        color: '#0ea5e9',
        subsections: ['Хобби', 'Релакс', 'Развлечения', 'Сон']
    }
];

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Загрузка данных
    loadUserData();
    
    // Инициализация интерфейса
    initUI();
    
    // Инициализация навигации
    initNavigation();
    
    // Инициализация календаря
    initCalendar();
    
    // Настройка обработчиков событий
    setupEventHandlers();
    
    // Загрузка начальных данных
    loadTodayTasks();
    updateDayProgress();
    updateStats();
    
    // Обновление даты в шапке
    updateHeaderDate();
}

function loadUserData() {
    const saved = localStorage.getItem('lifeContourData');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
            createInitialData();
        }
    } else {
        createInitialData();
    }
    
    // Инициализация сфер если их нет
    spheres.forEach(sphere => {
        if (!currentUser.spheres[sphere.id]) {
            currentUser.spheres[sphere.id] = {
                goals: [],
                progress: 0
            };
        }
    });
}

function createInitialData() {
    // Создаем тестовые данные
    const today = new Date().toISOString().split('T')[0];
    
    currentUser.tasks = [
        {
            id: '1',
            title: 'Утренняя зарядка',
            sphere: 'health',
            date: today,
            time: '07:00',
            duration: 0.5,
            priority: 'medium',
            completed: false
        },
        {
            id: '2',
            title: 'Работа над проектом',
            sphere: 'finance',
            date: today,
            time: '09:00',
            duration: 4,
            priority: 'high',
            completed: true
        },
        {
            id: '3',
            title: 'Чтение книги',
            sphere: 'study',
            date: today,
            time: '20:00',
            duration: 1,
            priority: 'low',
            completed: false
        }
    ];
    
    currentUser.financialData.income = [
        { id: '1', amount: 50000, description: 'Зарплата', date: today, category: 'работа' },
        { id: '2', amount: 10000, description: 'Фриланс', date: today, category: 'дополнительный доход' }
    ];
    
    currentUser.financialData.expenses = [
        { id: '1', amount: 15000, description: 'Аренда квартиры', date: today, category: 'жилье' },
        { id: '2', amount: 5000, description: 'Продукты', date: today, category: 'еда' }
    ];
    
    currentUser.financialData.wallet = 40000;
    currentUser.financialData.capital = 100000;
    
    currentUser.relationshipsData.people = [
        { id: '1', name: 'Мама', category: 'семья', lastContact: today, notes: 'Позвонить в воскресенье' }
    ];
    
    saveUserData();
}

function saveUserData() {
    localStorage.setItem('lifeContourData', JSON.stringify(currentUser));
}

function initUI() {
    // Устанавливаем сегодняшнюю дату в поле даты
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('task-date').value = today;
}

function initNavigation() {
    // Нижняя навигация
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            switchSection(section);
            
            // Обновляем активный элемент
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Кнопка добавления
    document.getElementById('add-button').addEventListener('click', openTaskModal);
}

function switchSection(sectionId) {
    // Скрываем все секции
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Показываем выбранную секцию
    document.getElementById(sectionId + '-section').classList.add('active');
    
    // Обновляем данные для секции
    switch(sectionId) {
        case 'today':
            loadTodayTasks();
            updateDayProgress();
            break;
        case 'calendar':
            if (calendar) {
                calendar.render();
            }
            break;
        case 'spheres':
            loadSpheres();
            break;
        case 'stats':
            updateStats();
            break;
    }
}

function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'ru',
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'title',
            center: '',
            right: 'today prev,next'
        },
        height: '100%',
        events: generateCalendarEvents(),
        eventClick: function(info) {
            const taskId = info.event.id;
            const task = currentUser.tasks.find(t => t.id === taskId);
            if (task) {
                openTaskViewModal(task);
            }
        },
        dateClick: function(info) {
            // При клике на дату переключаемся на вид дня
            calendar.changeView('timeGridDay', info.dateStr);
        }
    });
    
    calendar.render();
    
    // Кнопки переключения вида календаря
    document.querySelectorAll('.calendar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Обновляем активную кнопку
            document.querySelectorAll('.calendar-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Меняем вид календаря
            switch(view) {
                case 'day':
                    calendar.changeView('timeGridDay');
                    break;
                case 'week':
                    calendar.changeView('timeGridWeek');
                    break;
                case 'month':
                    calendar.changeView('dayGridMonth');
                    break;
            }
        });
    });
    
    // Кнопки навигации
    document.getElementById('prev-btn').addEventListener('click', function() {
        calendar.prev();
        updateHeaderDate();
    });
    
    document.getElementById('next-btn').addEventListener('click', function() {
        calendar.next();
        updateHeaderDate();
    });
    
    document.getElementById('today-btn').addEventListener('click', function() {
        calendar.today();
        updateHeaderDate();
    });
}

function updateHeaderDate() {
    const view = calendar.view;
    let dateText = '';
    
    if (view.type === 'dayGridMonth') {
        const month = view.currentStart.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
        dateText = month.charAt(0).toUpperCase() + month.slice(1);
    } else if (view.type === 'timeGridWeek') {
        const start = view.currentStart;
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        
        const startStr = start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        const endStr = end.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
        dateText = `${startStr} - ${endStr}`;
    } else if (view.type === 'timeGridDay') {
        dateText = view.currentStart.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
        dateText = dateText.charAt(0).toUpperCase() + dateText.slice(1);
    }
    
    document.getElementById('header-date').textContent = dateText;
}

function generateCalendarEvents() {
    return currentUser.tasks.map(task => {
        const sphere = spheres.find(s => s.id === task.sphere);
        const start = new Date(task.date + 'T' + task.time);
        const end = new Date(start.getTime() + task.duration * 60 * 60 * 1000);
        
        return {
            id: task.id,
            title: task.title,
            start: start,
            end: end,
            backgroundColor: sphere ? sphere.color : '#4361ee',
            borderColor: sphere ? sphere.color : '#4361ee',
            extendedProps: {
                sphere: task.sphere,
                completed: task.completed
            }
        };
    });
}

function setupEventHandlers() {
    // Закрытие модальных окон
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

function loadTodayTasks() {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = currentUser.tasks.filter(task => task.date === today);
    const container = document.getElementById('today-tasks');
    
    if (todayTasks.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 30px 20px; color: var(--text-secondary);">
                <i class="fas fa-tasks" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>Нет задач на сегодня</p>
                <button class="btn" onclick="openTaskModal()" style="margin-top: 15px; width: 100%;">
                    <i class="fas fa-plus"></i> Добавить задачу
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    todayTasks.forEach(task => {
        const sphere = spheres.find(s => s.id === task.sphere);
        html += `
            <div class="today-task ${task.completed ? 'completed' : ''}" onclick="toggleTaskCompletion('${task.id}')">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                       onclick="event.stopPropagation(); toggleTaskCompletion('${task.id}')">
                <div class="task-info">
                    <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
                    <div class="task-sphere">
                        <div class="task-sphere-dot" style="background: ${sphere.color}"></div>
                        ${sphere.name}
                        <span style="margin-left: auto; font-size: 11px; color: var(--text-muted);">
                            ${task.time} (${task.duration}ч)
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateDayProgress() {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = currentUser.tasks.filter(task => task.date === today);
    const completedTasks = todayTasks.filter(task => task.completed).length;
    const progress = todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0;
    
    const container = document.getElementById('day-progress-details');
    
    container.innerHTML = `
        <div style="text-align: center; padding: 10px;">
            <div style="font-size: 32px; font-weight: 700; color: var(--primary); margin-bottom: 10px;">
                ${progress}%
            </div>
            <div style="width: 100%; height: 8px; background: var(--gray-light); border-radius: 4px; overflow: hidden; margin-bottom: 15px;">
                <div style="width: ${progress}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--primary-dark));"></div>
            </div>
            <div style="display: flex; justify-content: space-around;">
                <div>
                    <div style="font-size: 18px; font-weight: 600; color: var(--success);">${completedTasks}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Выполнено</div>
                </div>
                <div>
                    <div style="font-size: 18px; font-weight: 600; color: var(--warning);">${todayTasks.length - completedTasks}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Осталось</div>
                </div>
                <div>
                    <div style="font-size: 18px; font-weight: 600; color: var(--text-primary);">${todayTasks.length}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Всего</div>
                </div>
            </div>
        </div>
    `;
}

function openTaskModal() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('task-date').value = today;
    document.getElementById('task-modal').classList.add('active');
}

function saveTask() {
    const title = document.getElementById('task-title').value.trim();
    const sphere = document.getElementById('task-sphere').value;
    const date = document.getElementById('task-date').value;
    const time = document.getElementById('task-time').value;
    const duration = parseFloat(document.getElementById('task-duration').value);
    const priority = document.getElementById('task-priority').value;
    
    if (!title) {
        showNotification('Введите название задачи', 'error');
        return;
    }
    
    const task = {
        id: Date.now().toString(),
        title: title,
        sphere: sphere,
        date: date,
        time: time,
        duration: duration,
        priority: priority,
        completed: false
    };
    
    currentUser.tasks.push(task);
    saveUserData();
    
    closeModal('task-modal');
    showNotification('Задача добавлена', 'success');
    
    // Обновляем интерфейс
    loadTodayTasks();
    updateDayProgress();
    updateStats();
    
    // Обновляем календарь
    if (calendar) {
        calendar.removeAllEvents();
        calendar.addEventSource(generateCalendarEvents());
        calendar.render();
    }
}

function toggleTaskCompletion(taskId) {
    const task = currentUser.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveUserData();
        
        loadTodayTasks();
        updateDayProgress();
        updateStats();
        
        if (calendar) {
            calendar.removeAllEvents();
            calendar.addEventSource(generateCalendarEvents());
            calendar.render();
        }
        
        showNotification(task.completed ? 'Задача выполнена!' : 'Задача не выполнена', 'success');
    }
}

function openTaskViewModal(task) {
    const sphere = spheres.find(s => s.id === task.sphere);
    const modal = document.getElementById('record-modal');
    const content = document.getElementById('record-modal-content');
    
    content.innerHTML = `
        <div style="margin-bottom: 20px;">
            <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">${task.title}</div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background: ${sphere.color};"></div>
                <span>${sphere.name}</span>
            </div>
            <div style="color: var(--text-secondary); margin-bottom: 5px;">
                <i class="far fa-calendar"></i> ${task.date} в ${task.time}
            </div>
            <div style="color: var(--text-secondary); margin-bottom: 15px;">
                <i class="far fa-clock"></i> ${task.duration} часа
            </div>
            <div style="padding: 10px; background: ${task.completed ? 'var(--success-light)' : 'var(--warning-light)'}; 
                 border-radius: 8px; color: ${task.completed ? 'var(--success)' : 'var(--warning)'};">
                ${task.completed ? '✓ Выполнено' : '⌛ В процессе'}
            </div>
        </div>
        
        <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary" style="flex: 1;" onclick="toggleTaskCompletion('${task.id}'); closeModal('record-modal')">
                ${task.completed ? 'Отметить как не выполненную' : 'Отметить как выполненную'}
            </button>
            <button class="btn" style="flex: 1; background: var(--danger); color: white;" 
                    onclick="deleteTask('${task.id}'); closeModal('record-modal')">
                <i class="fas fa-trash"></i> Удалить
            </button>
        </div>
    `;
    
    document.getElementById('record-modal-title').textContent = 'Просмотр задачи';
    modal.classList.add('active');
}

function deleteTask(taskId) {
    if (confirm('Удалить задачу?')) {
        currentUser.tasks = currentUser.tasks.filter(t => t.id !== taskId);
        saveUserData();
        
        loadTodayTasks();
        updateDayProgress();
        updateStats();
        
        if (calendar) {
            calendar.removeAllEvents();
            calendar.addEventSource(generateCalendarEvents());
            calendar.render();
        }
        
        showNotification('Задача удалена', 'success');
    }
}

function loadSpheres() {
    const container = document.getElementById('spheres-container');
    const subsection = document.getElementById('sphere-subsection');
    
    // Если открыт подраздел, показываем его
    if (selectedSphere && subsection.style.display === 'block') {
        showSphereSubsection(selectedSphere);
        return;
    }
    
    // Показываем сетку сфер
    subsection.style.display = 'none';
    container.style.display = 'grid';
    
    let html = '';
    spheres.forEach(sphere => {
        const sphereData = currentUser.spheres[sphere.id] || { goals: [], progress: 0 };
        const goalsCount = sphereData.goals.length;
        
        html += `
            <div class="sphere-card ${sphere.id}" onclick="showSphereSubsection('${sphere.id}')">
                <div class="sphere-icon">${sphere.icon}</div>
                <div class="sphere-name">${sphere.name}</div>
                <div class="sphere-count">${goalsCount}</div>
                <div class="sphere-progress">
                    <div class="sphere-progress-text">Прогресс: ${sphereData.progress}%</div>
                    <div class="sphere-progress-bar">
                        <div class="sphere-progress-fill" style="width: ${sphereData.progress}%; background: ${sphere.color};"></div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function showSphereSubsection(sphereId) {
    const sphere = spheres.find(s => s.id === sphereId);
    selectedSphere = sphereId;
    
    const container = document.getElementById('spheres-container');
    const subsection = document.getElementById('sphere-subsection');
    
    container.style.display = 'none';
    subsection.style.display = 'block';
    
    subsection.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button class="btn" onclick="backToSpheresGrid()" style="margin-bottom: 20px; width: 100%;">
                <i class="fas fa-arrow-left"></i> Назад к сферам
            </button>
            
            <div class="subsection-header">
                <div style="width: 20px; height: 20px; border-radius: 50%; background: ${sphere.color};"></div>
                <div class="subsection-title">${sphere.name}</div>
            </div>
            
            <div class="subsection-tabs">
                ${sphere.subsections.map((sub, index) => `
                    <button class="subsection-tab ${index === 0 ? 'active' : ''}" 
                            onclick="showSphereTab('${sphereId}', '${sub}')">
                        ${sub}
                    </button>
                `).join('')}
            </div>
            
            <div class="subsection-content" id="sphere-content-${sphereId}">
                ${getSphereContent(sphereId, sphere.subsections[0])}
            </div>
        </div>
    `;
}

function backToSpheresGrid() {
    selectedSphere = null;
    const container = document.getElementById('spheres-container');
    const subsection = document.getElementById('sphere-subsection');
    
    container.style.display = 'grid';
    subsection.style.display = 'none';
    loadSpheres();
}

function showSphereTab(sphereId, tabName) {
    // Обновляем активную вкладку
    const tabs = document.querySelectorAll(`#sphere-subsection .subsection-tab`);
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Обновляем содержимое
    const content = document.getElementById(`sphere-content-${sphereId}`);
    content.innerHTML = getSphereContent(sphereId, tabName);
}

function getSphereContent(sphereId, tabName) {
    switch(sphereId) {
        case 'finance':
            return getFinanceContent(tabName);
        case 'health':
            return getHealthContent(tabName);
        case 'relationships':
            return getRelationshipsContent(tabName);
        default:
            return getDefaultContent(sphereId, tabName);
    }
}

function getFinanceContent(tabName) {
    let html = '';
    
    switch(tabName) {
        case 'Доходы':
            html = `
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-primary" onclick="openFinanceModal('income')" style="width: 100%;">
                        <i class="fas fa-plus-circle"></i> Добавить доход
                    </button>
                </div>
                
                <div class="record-list">
                    ${currentUser.financialData.income.map(income => `
                        <div class="record-item">
                            <div class="record-info">
                                <div class="record-amount record-income">+${income.amount.toLocaleString()} ₽</div>
                                <div class="record-description">${income.description}</div>
                                <div class="record-date">${income.date} • ${income.category}</div>
                            </div>
                            <div class="record-actions">
                                <button class="btn" onclick="editFinanceRecord('income', '${income.id}')" style="padding: 5px 10px;">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                    
                    ${currentUser.financialData.income.length === 0 ? `
                        <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                            <i class="fas fa-money-bill-wave" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                            <p>Нет записей о доходах</p>
                        </div>
                    ` : ''}
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: var(--success-light); border-radius: 12px; text-align: center;">
                    <div style="font-size: 12px; color: var(--text-secondary);">Общая сумма доходов</div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--success);">
                        ${currentUser.financialData.income.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} ₽
                    </div>
                </div>
            `;
            break;
            
        case 'Расходы':
            html = `
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-primary" onclick="openFinanceModal('expense')" style="width: 100%;">
                        <i class="fas fa-minus-circle"></i> Добавить расход
                    </button>
                </div>
                
                <div class="record-list">
                    ${currentUser.financialData.expenses.map(expense => `
                        <div class="record-item">
                            <div class="record-info">
                                <div class="record-amount record-expense">-${expense.amount.toLocaleString()} ₽</div>
                                <div class="record-description">${expense.description}</div>
                                <div class="record-date">${expense.date} • ${expense.category}</div>
                            </div>
                            <div class="record-actions">
                                <button class="btn" onclick="editFinanceRecord('expense', '${expense.id}')" style="padding: 5px 10px;">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                    
                    ${currentUser.financialData.expenses.length === 0 ? `
                        <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                            <i class="fas fa-shopping-cart" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                            <p>Нет записей о расходах</p>
                        </div>
                    ` : ''}
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: var(--danger-light); border-radius: 12px; text-align: center;">
                    <div style="font-size: 12px; color: var(--text-secondary);">Общая сумма расходов</div>
                    <div style="font-size: 24px; font-weight: 700; color: var(--danger);">
                        ${currentUser.financialData.expenses.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} ₽
                    </div>
                </div>
            `;
            break;
            
        case 'Инвестиции':
            html = `
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-primary" onclick="openFinanceModal('investment')" style="width: 100%;">
                        <i class="fas fa-chart-line"></i> Добавить инвестицию
                    </button>
                </div>
                
                <div class="record-list">
                    ${currentUser.financialData.investments.map(investment => `
                        <div class="record-item">
                            <div class="record-info">
                                <div class="record-amount">${investment.amount.toLocaleString()} ₽</div>
                                <div class="record-description">${investment.name}</div>
                                <div class="record-date">${investment.date} • Доходность: ${investment.return || 0}%</div>
                            </div>
                        </div>
                    `).join('')}
                    
                    ${currentUser.financialData.investments.length === 0 ? `
                        <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                            <i class="fas fa-coins" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                            <p>Нет записей об инвестициях</p>
                        </div>
                    ` : ''}
                </div>
            `;
            break;
            
        case 'Капитал':
            const totalIncome = currentUser.financialData.income.reduce((sum, item) => sum + item.amount, 0);
            const totalExpenses = currentUser.financialData.expenses.reduce((sum, item) => sum + item.amount, 0);
            const balance = totalIncome - totalExpenses;
            
            html = `
                <div style="margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                        <div style="padding: 15px; background: var(--success-light); border-radius: 12px; text-align: center;">
                            <div style="font-size: 12px; color: var(--text-secondary);">Текущий капитал</div>
                            <div style="font-size: 20px; font-weight: 700; color: var(--success);">
                                ${currentUser.financialData.capital.toLocaleString()} ₽
                            </div>
                        </div>
                        <div style="padding: 15px; background: var(--gray-lighter); border-radius: 12px; text-align: center;">
                            <div style="font-size: 12px; color: var(--text-secondary);">Баланс</div>
                            <div style="font-size: 20px; font-weight: 700; color: ${balance >= 0 ? 'var(--success)' : 'var(--danger)'};">
                                ${balance.toLocaleString()} ₽
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary" onclick="openFinanceModal('capital')" style="width: 100%;">
                        <i class="fas fa-piggy-bank"></i> Установить капитал
                    </button>
                </div>
            `;
            break;
    }
    
    return html;
}

function getHealthContent(tabName) {
    let html = '';
    
    switch(tabName) {
        case 'Активность':
            html = `
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-primary" onclick="openHealthModal('activity')" style="width: 100%;">
                        <i class="fas fa-running"></i> Добавить активность
                    </button>
                </div>
                
                <div class="record-list">
                    ${currentUser.healthData.activities.map(activity => `
                        <div class="record-item">
                            <div class="record-info">
                                <div style="font-weight: 600;">${activity.type}</div>
                                <div class="record-description">${activity.duration} минут</div>
                                <div class="record-date">${activity.date}</div>
                            </div>
                            ${activity.calories ? `<div style="color: var(--health); font-weight: 600;">${activity.calories} ккал</div>` : ''}
                        </div>
                    `).join('')}
                    
                    ${currentUser.healthData.activities.length === 0 ? `
                        <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                            <i class="fas fa-running" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                            <p>Нет записей об активности</p>
                        </div>
                    ` : ''}
                </div>
            `;
            break;
            
        case 'Сон':
            html = `
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-primary" onclick="openHealthModal('sleep')" style="width: 100%;">
                        <i class="fas fa-bed"></i> Добавить запись сна
                    </button>
                </div>
                
                <div class="record-list">
                    ${currentUser.healthData.sleep.map(sleep => `
                        <div class="record-item">
                            <div class="record-info">
                                <div style="font-weight: 600;">${sleep.hours} часов</div>
                                <div class="record-description">Качество: ${sleep.quality === 'good' ? 'Хорошее' : sleep.quality === 'excellent' ? 'Отличное' : 'Плохое'}</div>
                                <div class="record-date">${sleep.date}</div>
                            </div>
                        </div>
                    `).join('')}
                    
                    ${currentUser.healthData.sleep.length === 0 ? `
                        <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                            <i class="fas fa-bed" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                            <p>Нет записей о сне</p>
                        </div>
                    ` : ''}
                </div>
            `;
            break;
            
        default:
            html = `
                <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                    <i class="fas fa-heartbeat" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>Раздел в разработке</p>
                </div>
            `;
    }
    
    return html;
}

function getRelationshipsContent(tabName) {
    let html = '';
    
    switch(tabName) {
        case 'Люди':
            html = `
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-primary" onclick="openRelationshipsModal('person')" style="width: 100%;">
                        <i class="fas fa-user-plus"></i> Добавить человека
                    </button>
                </div>
                
                <div class="record-list">
                    ${currentUser.relationshipsData.people.map(person => `
                        <div class="record-item">
                            <div class="record-info">
                                <div style="font-weight: 600;">${person.name}</div>
                                <div class="record-description">${person.category}</div>
                                <div class="record-date">Последний контакт: ${person.lastContact}</div>
                                ${person.notes ? `<div style="font-size: 13px; color: var(--text-secondary); margin-top: 5px;">${person.notes}</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                    
                    ${currentUser.relationshipsData.people.length === 0 ? `
                        <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                            <i class="fas fa-users" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                            <p>Нет записей о людях</p>
                        </div>
                    ` : ''}
                </div>
            `;
            break;
            
        default:
            html = `
                <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                    <i class="fas fa-heart" style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>Раздел в разработке</p>
                </div>
            `;
    }
    
    return html;
}

function getDefaultContent(sphereId, tabName) {
    const sphere = spheres.find(s => s.id === sphereId);
    
    return `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
            <div style="font-size: 40px; margin-bottom: 15px; opacity: 0.5;">${sphere.icon}</div>
            <p style="font-weight: 600; margin-bottom: 5px;">${sphere.name}</p>
            <p>Раздел "${tabName}" в разработке</p>
            <button class="btn" onclick="openDefaultModal('${sphereId}', '${tabName}')" style="margin-top: 15px; width: 100%;">
                <i class="fas fa-plus"></i> Добавить запись в ${tabName.toLowerCase()}
            </button>
        </div>
    `;
}

function openFinanceModal(type) {
    const modal = document.getElementById('finance-modal');
    const title = document.getElementById('finance-modal-title');
    const content = document.getElementById('finance-modal-content');
    
    let html = '';
    
    switch(type) {
        case 'income':
            title.textContent = 'Добавить доход';
            html = `
                <div class="form-group">
                    <label class="form-label">Сумма (₽)</label>
                    <input type="number" id="finance-amount" class="form-control" placeholder="1000" min="0" step="100">
                </div>
                <div class="form-group">
                    <label class="form-label">Описание</label>
                    <input type="text" id="finance-description" class="form-control" placeholder="Например: Зарплата">
                </div>
                <div class="form-group">
                    <label class="form-label">Категория</label>
                    <select id="finance-category" class="form-control form-select">
                        <option value="работа">Работа</option>
                        <option value="фриланс">Фриланс</option>
                        <option value="инвестиции">Инвестиции</option>
                        <option value="подарок">Подарок</option>
                        <option value="другое">Другое</option>
                    </select>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-primary" style="flex: 1;" onclick="saveFinanceRecord('income')">
                        <i class="fas fa-save"></i> Сохранить
                    </button>
                    <button class="btn" style="flex: 1; background: var(--gray-light);" onclick="closeModal('finance-modal')">
                        Отмена
                    </button>
                </div>
            `;
            break;
            
        case 'expense':
            title.textContent = 'Добавить расход';
            html = `
                <div class="form-group">
                    <label class="form-label">Сумма (₽)</label>
                    <input type="number" id="finance-amount" class="form-control" placeholder="1000" min="0" step="100">
                </div>
                <div class="form-group">
                    <label class="form-label">Описание</label>
                    <input type="text" id="finance-description" class="form-control" placeholder="Например: Продукты">
                </div>
                <div class="form-group">
                    <label class="form-label">Категория</label>
                    <select id="finance-category" class="form-control form-select">
                        <option value="еда">Еда</option>
                        <option value="транспорт">Транспорт</option>
                        <option value="жилье">Жилье</option>
                        <option value="развлечения">Развлечения</option>
                        <option value="здоровье">Здоровье</option>
                        <option value="другое">Другое</option>
                    </select>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-primary" style="flex: 1;" onclick="saveFinanceRecord('expense')">
                        <i class="fas fa-save"></i> Сохранить
                    </button>
                    <button class="btn" style="flex: 1; background: var(--gray-light);" onclick="closeModal('finance-modal')">
                        Отмена
                    </button>
                </div>
            `;
            break;
            
        case 'capital':
            title.textContent = 'Установить капитал';
            html = `
                <div class="form-group">
                    <label class="form-label">Текущий капитал (₽)</label>
                    <input type="number" id="capital-amount" class="form-control" value="${currentUser.financialData.capital}" min="0" step="1000">
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-primary" style="flex: 1;" onclick="saveCapital()">
                        <i class="fas fa-save"></i> Сохранить
                    </button>
                    <button class="btn" style="flex: 1; background: var(--gray-light);" onclick="closeModal('finance-modal')">
                        Отмена
                    </button>
                </div>
            `;
            break;
    }
    
    content.innerHTML = html;
    modal.classList.add('active');
}

function saveFinanceRecord(type) {
    const amount = parseFloat(document.getElementById('finance-amount').value);
    const description = document.getElementById('finance-description').value.trim();
    const category = document.getElementById('finance-category').value;
    const today = new Date().toISOString().split('T')[0];
    
    if (!amount || amount <= 0 || !description) {
        showNotification('Заполните все поля правильно', 'error');
        return;
    }
    
    const record = {
        id: Date.now().toString(),
        amount: amount,
        description: description,
        date: today,
        category: category
    };
    
    if (type === 'income') {
        currentUser.financialData.income.push(record);
        currentUser.financialData.wallet += amount;
    } else {
        currentUser.financialData.expenses.push(record);
        currentUser.financialData.wallet -= amount;
    }
    
    saveUserData();
    closeModal('finance-modal');
    
    // Обновляем отображение сферы
    if (selectedSphere === 'finance') {
        showSphereSubsection('finance');
    }
    
    showNotification(type === 'income' ? 'Доход добавлен' : 'Расход добавлен', 'success');
}

function saveCapital() {
    const amount = parseFloat(document.getElementById('capital-amount').value);
    
    if (amount < 0) {
        showNotification('Капитал не может быть отрицательным', 'error');
        return;
    }
    
    currentUser.financialData.capital = amount;
    saveUserData();
    closeModal('finance-modal');
    
    if (selectedSphere === 'finance') {
        showSphereSubsection('finance');
    }
    
    showNotification('Капитал обновлен', 'success');
}

function openHealthModal(type) {
    const modal = document.getElementById('record-modal');
    const title = document.getElementById('record-modal-title');
    const content = document.getElementById('record-modal-content');
    
    let html = '';
    
    switch(type) {
        case 'activity':
            title.textContent = 'Добавить активность';
            html = `
                <div class="form-group">
                    <label class="form-label">Тип активности</label>
                    <select id="activity-type" class="form-control form-select">
                        <option value="бег">Бег</option>
                        <option value="ходьба">Ходьба</option>
                        <option value="тренажерный зал">Тренажерный зал</option>
                        <option value="йога">Йога</option>
                        <option value="плавание">Плавание</option>
                        <option value="велосипед">Велосипед</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Длительность (минут)</label>
                    <input type="number" id="activity-duration" class="form-control" value="30" min="1" max="300">
                </div>
                <div class="form-group">
                    <label class="form-label">Сожженные калории (необязательно)</label>
                    <input type="number" id="activity-calories" class="form-control" placeholder="300" min="0">
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-primary" style="flex: 1;" onclick="saveActivity()">
                        <i class="fas fa-save"></i> Сохранить
                    </button>
                    <button class="btn" style="flex: 1; background: var(--gray-light);" onclick="closeModal('record-modal')">
                        Отмена
                    </button>
                </div>
            `;
            break;
            
        case 'sleep':
            title.textContent = 'Добавить запись сна';
            html = `
                <div class="form-group">
                    <label class="form-label">Часы сна</label>
                    <input type="number" id="sleep-hours" class="form-control" value="8" min="0" max="24" step="0.5">
                </div>
                <div class="form-group">
                    <label class="form-label">Качество сна</label>
                    <select id="sleep-quality" class="form-control form-select">
                        <option value="excellent">Отличное</option>
                        <option value="good" selected>Хорошее</option>
                        <option value="poor">Плохое</option>
                    </select>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-primary" style="flex: 1;" onclick="saveSleep()">
                        <i class="fas fa-save"></i> Сохранить
                    </button>
                    <button class="btn" style="flex: 1; background: var(--gray-light);" onclick="closeModal('record-modal')">
                        Отмена
                    </button>
                </div>
            `;
            break;
    }
    
    content.innerHTML = html;
    modal.classList.add('active');
}

function saveActivity() {
    const type = document.getElementById('activity-type').value;
    const duration = parseInt(document.getElementById('activity-duration').value);
    const calories = document.getElementById('activity-calories').value;
    const today = new Date().toISOString().split('T')[0];
    
    if (!duration || duration <= 0) {
        showNotification('Укажите длительность активности', 'error');
        return;
    }
    
    const activity = {
        id: Date.now().toString(),
        type: type,
        duration: duration,
        calories: calories ? parseInt(calories) : null,
        date: today
    };
    
    currentUser.healthData.activities.push(activity);
    saveUserData();
    closeModal('record-modal');
    
    if (selectedSphere === 'health') {
        showSphereSubsection('health');
    }
    
    showNotification('Активность добавлена', 'success');
}

function saveSleep() {
    const hours = parseFloat(document.getElementById('sleep-hours').value);
    const quality = document.getElementById('sleep-quality').value;
    const today = new Date().toISOString().split('T')[0];
    
    if (!hours || hours <= 0) {
        showNotification('Укажите количество часов сна', 'error');
        return;
    }
    
    const sleep = {
        id: Date.now().toString(),
        hours: hours,
        quality: quality,
        date: today
    };
    
    currentUser.healthData.sleep.push(sleep);
    saveUserData();
    closeModal('record-modal');
    
    if (selectedSphere === 'health') {
        showSphereSubsection('health');
    }
    
    showNotification('Запись сна добавлена', 'success');
}

function openRelationshipsModal(type) {
    const modal = document.getElementById('record-modal');
    const title = document.getElementById('record-modal-title');
    const content = document.getElementById('record-modal-content');
    
    if (type === 'person') {
        title.textContent = 'Добавить человека';
        content.innerHTML = `
            <div class="form-group">
                <label class="form-label">Имя</label>
                <input type="text" id="person-name" class="form-control" placeholder="Например: Мама, Друг">
            </div>
            <div class="form-group">
                <label class="form-label">Категория</label>
                <select id="person-category" class="form-control form-select">
                    <option value="семья">Семья</option>
                    <option value="друзья">Друзья</option>
                    <option value="коллеги">Коллеги</option>
                    <option value="знакомые">Знакомые</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Заметки (необязательно)</label>
                <textarea id="person-notes" class="form-control" rows="3" placeholder="Например: Позвонить в воскресенье"></textarea>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-primary" style="flex: 1;" onclick="savePerson()">
                    <i class="fas fa-save"></i> Сохранить
                </button>
                <button class="btn" style="flex: 1; background: var(--gray-light);" onclick="closeModal('record-modal')">
                    Отмена
                </button>
            </div>
        `;
    }
    
    modal.classList.add('active');
}

function savePerson() {
    const name = document.getElementById('person-name').value.trim();
    const category = document.getElementById('person-category').value;
    const notes = document.getElementById('person-notes').value.trim();
    const today = new Date().toISOString().split('T')[0];
    
    if (!name) {
        showNotification('Введите имя', 'error');
        return;
    }
    
    const person = {
        id: Date.now().toString(),
        name: name,
        category: category,
        lastContact: today,
        notes: notes
    };
    
    currentUser.relationshipsData.people.push(person);
    saveUserData();
    closeModal('record-modal');
    
    if (selectedSphere === 'relationships') {
        showSphereSubsection('relationships');
    }
    
    showNotification('Человек добавлен', 'success');
}

function openDefaultModal(sphereId, tabName) {
    const modal = document.getElementById('record-modal');
    const title = document.getElementById('record-modal-title');
    const content = document.getElementById('record-modal-content');
    
    title.textContent = `Добавить запись в ${tabName.toLowerCase()}`;
    content.innerHTML = `
        <div class="form-group">
            <label class="form-label">Название</label>
            <input type="text" id="default-title" class="form-control" placeholder="Введите название">
        </div>
        <div class="form-group">
            <label class="form-label">Описание (необязательно)</label>
            <textarea id="default-description" class="form-control" rows="3" placeholder="Дополнительная информация"></textarea>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button class="btn btn-primary" style="flex: 1;" onclick="saveDefaultRecord('${sphereId}', '${tabName}')">
                <i class="fas fa-save"></i> Сохранить
            </button>
            <button class="btn" style="flex: 1; background: var(--gray-light);" onclick="closeModal('record-modal')">
                Отмена
            </button>
        </div>
    `;
    
    modal.classList.add('active');
}

function saveDefaultRecord(sphereId, tabName) {
    const title = document.getElementById('default-title').value.trim();
    const description = document.getElementById('default-description').value.trim();
    const today = new Date().toISOString().split('T')[0];
    
    if (!title) {
        showNotification('Введите название', 'error');
        return;
    }
    
    // Для демонстрации просто показываем уведомление
    showNotification(`Запись "${title}" добавлена в ${tabName.toLowerCase()}`, 'success');
    closeModal('record-modal');
}

function updateStats() {
    const totalTasks = currentUser.tasks.length;
    const completedTasks = currentUser.tasks.filter(task => task.completed).length;
    
    // Подсчитываем цели
    let totalGoals = 0;
    let completedGoals = 0;
    
    spheres.forEach(sphere => {
        const sphereData = currentUser.spheres[sphere.id];
        if (sphereData && sphereData.goals) {
            totalGoals += sphereData.goals.length;
            completedGoals += sphereData.goals.filter(goal => goal.completed).length;
        }
    });
    
    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('total-goals').textContent = totalGoals;
    document.getElementById('completed-goals').textContent = completedGoals;
    
    updateChart();
}

function updateChart() {
    const ctx = document.getElementById('activity-chart');
    if (!ctx) return;
    
    if (activityChart) {
        activityChart.destroy();
    }
    
    // Собираем данные за последние 7 дней
    const labels = [];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
        labels.push(dayName.charAt(0).toUpperCase() + dayName.slice(1));
        
        const tasksForDay = currentUser.tasks.filter(task => task.date === dateStr && task.completed);
        data.push(tasksForDay.length);
    }
    
    activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Выполненные задачи',
                data: data,
                backgroundColor: '#4361ee',
                borderColor: '#3a0ca3',
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Вспомогательные функции для редактирования записей
function editFinanceRecord(type, recordId) {
    let records, title;
    
    if (type === 'income') {
        records = currentUser.financialData.income;
        title = 'Редактировать доход';
    } else {
        records = currentUser.financialData.expenses;
        title = 'Редактировать расход';
    }
    
    const record = records.find(r => r.id === recordId);
    if (!record) return;
    
    const modal = document.getElementById('finance-modal');
    const modalTitle = document.getElementById('finance-modal-title');
    const content = document.getElementById('finance-modal-content');
    
    modalTitle.textContent = title;
    content.innerHTML = `
        <div class="form-group">
            <label class="form-label">Сумма (₽)</label>
            <input type="number" id="finance-amount" class="form-control" value="${record.amount}" min="0" step="100">
        </div>
        <div class="form-group">
            <label class="form-label">Описание</label>
            <input type="text" id="finance-description" class="form-control" value="${record.description}">
        </div>
        <div class="form-group">
            <label class="form-label">Категория</label>
            <select id="finance-category" class="form-control form-select">
                <option value="работа" ${record.category === 'работа' ? 'selected' : ''}>Работа</option>
                <option value="фриланс" ${record.category === 'фриланс' ? 'selected' : ''}>Фриланс</option>
                <option value="инвестиции" ${record.category === 'инвестиции' ? 'selected' : ''}>Инвестиции</option>
                <option value="подарок" ${record.category === 'подарок' ? 'selected' : ''}>Подарок</option>
                <option value="другое" ${record.category === 'другое' ? 'selected' : ''}>Другое</option>
            </select>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button class="btn btn-primary" style="flex: 1;" onclick="updateFinanceRecord('${type}', '${recordId}')">
                <i class="fas fa-save"></i> Сохранить
            </button>
            <button class="btn" style="flex: 1; background: var(--danger); color: white;" onclick="deleteFinanceRecord('${type}', '${recordId}')">
                <i class="fas fa-trash"></i> Удалить
            </button>
            <button class="btn" style="flex: 1; background: var(--gray-light);" onclick="closeModal('finance-modal')">
                Отмена
            </button>
        </div>
    `;
    
    modal.classList.add('active');
}

function updateFinanceRecord(type, recordId) {
    const amount = parseFloat(document.getElementById('finance-amount').value);
    const description = document.getElementById('finance-description').value.trim();
    const category = document.getElementById('finance-category').value;
    
    if (!amount || amount <= 0 || !description) {
        showNotification('Заполните все поля правильно', 'error');
        return;
    }
    
    let records;
    if (type === 'income') {
        records = currentUser.financialData.income;
    } else {
        records = currentUser.financialData.expenses;
    }
    
    const index = records.findIndex(r => r.id === recordId);
    if (index !== -1) {
        // Обновляем баланс
        const oldAmount = records[index].amount;
        const difference = amount - oldAmount;
        
        if (type === 'income') {
            currentUser.financialData.wallet += difference;
        } else {
            currentUser.financialData.wallet -= difference;
        }
        
        // Обновляем запись
        records[index].amount = amount;
        records[index].description = description;
        records[index].category = category;
        
        saveUserData();
        closeModal('finance-modal');
        
        if (selectedSphere === 'finance') {
            showSphereSubsection('finance');
        }
        
        showNotification('Запись обновлена', 'success');
    }
}

function deleteFinanceRecord(type, recordId) {
    if (!confirm('Удалить эту запись?')) return;
    
    let records;
    if (type === 'income') {
        records = currentUser.financialData.income;
    } else {
        records = currentUser.financialData.expenses;
    }
    
    const index = records.findIndex(r => r.id === recordId);
    if (index !== -1) {
        const record = records[index];
        
        // Обновляем баланс
        if (type === 'income') {
            currentUser.financialData.wallet -= record.amount;
        } else {
            currentUser.financialData.wallet += record.amount;
        }
        
        records.splice(index, 1);
        saveUserData();
        closeModal('finance-modal');
        
        if (selectedSphere === 'finance') {
            showSphereSubsection('finance');
        }
        
        showNotification('Запись удалена', 'success');
    }
}