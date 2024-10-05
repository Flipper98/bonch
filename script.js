// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Локальное хранилище данных
class LocalStorage {
    constructor(key) {
        this.key = key;
    }

    getData() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : null;
    }

    setData(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }
}

// Инициализация хранилищ
const homeworkStorage = new LocalStorage('homework');
const filesStorage = new LocalStorage('files');
const groupStorage = new LocalStorage('group');
const scheduleStorage = new LocalStorage('schedule');

// Начальные данные
const initialData = {
    homework: [],
    files: [],
    group: [],
    schedule: {
        monday: [
            { time: '9:00', subject: 'Математика', room: '302' },
            { time: '10:45', subject: 'Физика', room: '505' }
        ],
        tuesday: [
            { time: '9:00', subject: 'Информатика', room: '404' },
            { time: '10:45', subject: 'Английский', room: '205' }
        ],
        // Добавьте остальные дни
    }
};

// Инициализация данных при первом запуске
function initializeData() {
    if (!homeworkStorage.getData()) {
        homeworkStorage.setData(initialData.homework);
    }
    if (!filesStorage.getData()) {
        filesStorage.setData(initialData.files);
    }
    if (!groupStorage.getData()) {
        groupStorage.setData(initialData.group);
    }
    if (!scheduleStorage.getData()) {
        scheduleStorage.setData(initialData.schedule);
    }
}

// Функции для работы с домашними заданиями
function addHomework() {
    const subject = document.getElementById('homework-subject').value;
    const task = document.getElementById('homework-task').value;
    const deadline = document.getElementById('homework-deadline').value;
    
    if (subject && task && deadline) {
        const homework = homeworkStorage.getData() || [];
        homework.push({ subject, task, deadline });
        homeworkStorage.setData(homework);
        
        updateHomeworkList();
        
        // Очистка полей
        document.getElementById('homework-subject').value = '';
        document.getElementById('homework-task').value = '';
        document.getElementById('homework-deadline').value = '';
    }
}

function updateHomeworkList() {
    const homeworkList = document.getElementById('homework-list');
    const homework = homeworkStorage.getData() || [];
    
    homeworkList.innerHTML = homework.map((hw, index) => `
        <div class="item-card">
            <h3>${hw.subject}</h3>
            <p>${hw.task}</p>
            <p>Срок: ${hw.deadline}</p>
            <button onclick="deleteHomework(${index})">Удалить</button>
        </div>
    `).join('');
}

function deleteHomework(index) {
    const homework = homeworkStorage.getData() || [];
    homework.splice(index, 1);
    homeworkStorage.setData(homework);
    updateHomeworkList();
}

// Функции для работы с файлами
function addFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    
    if (file) {
        const files = filesStorage.getData() || [];
        files.push({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified).toLocaleString()
        });
        filesStorage.setData(files);
        
        updateFilesList();
        fileInput.value = '';
    }
}

function updateFilesList() {
    const filesList = document.getElementById('files-list');
    const files = filesStorage.getData() || [];
    
    filesList.innerHTML = files.map((file, index) => `
        <div class="item-card">
            <h3>${file.name}</h3>
            <p>Размер: ${formatFileSize(file.size)}</p>
            <p>Последнее изменение: ${file.lastModified}</p>
            <button onclick="deleteFile(${index})">Удалить</button>
        </div>
    `).join('');
}

function deleteFile(index) {
    const files = filesStorage.getData() || [];
    files.splice(index, 1);
    filesStorage.setData(files);
    updateFilesList();
}

// Функции для работы со списком группы
function addGroupMember() {
    const name = document.getElementById('group-member-name').value;
    const role = document.getElementById('group-member-role').value;
    
    if (name) {
        const group = groupStorage.getData() || [];
        group.push({ name, role });
        groupStorage.setData(group);
        
        updateGroupList();
        
        document.getElementById('group-member-name').value = '';
        document.getElementById('group-member-role').value = '';
    }
}

function updateGroupList() {
    const groupList = document.getElementById('group-list');
    const group = groupStorage.getData() || [];
    
    groupList.innerHTML = group.map((member, index) => `
        <div class="item-card">
            <h3>${member.name}</h3>
            ${member.role ? `<p>Роль: ${member.role}</p>` : ''}
            <button onclick="deleteGroupMember(${index})">Удалить</button>
        </div>
    `).join('');
}

function deleteGroupMember(index) {
    const group = groupStorage.getData() || [];
    group.splice(index, 1);
    groupStorage.setData(group);
    updateGroupList();
}

// Вспомогательные функции
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    updateHomeworkList();
    updateFilesList();
    updateGroupList();
});

// Обработчики событий
function showContent(contentId) {
    document.querySelectorAll('.content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(contentId).classList.add('active');
}
