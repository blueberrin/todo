// firebase setup
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref, push, update, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo5VOhI_Ma03UaeoEcDb70aWFyrZB5tY0",
  authDomain: "todo-8779e.firebaseapp.com",
  databaseURL: "https://todo-8779e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "todo-8779e",
  storageBucket: "todo-8779e.appspot.com",
  messagingSenderId: "384761476425",
  appId: "1:384761476425:web:038bc9f9332478b88d9698"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();
const addBtn = document.getElementById("addBtn");
const taskInput = document.querySelector(".task-input input");
const filters = document.querySelectorAll(".filters span");
const taskBox = document.querySelector(".task-box");



let isEditTask = false;

  function editTask(taskId, textName) {
    console.log("editTask called")
  isEditTask = true;
  taskInput.value = textName;
  taskInput.focus();
  taskInput.classList.add("active");
  const user = auth.currentUser;
  if (user) {
    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    get(taskRef)
      .then((snapshot) => {
        const task = snapshot.val();
        if (task) {
          taskInput.value = task.name;
          if (task.status === "completed") {
            document.getElementById(taskId).checked = true;
          }
        }
      })
      .catch((error) => {
        console.error("Error retrieving task:", error);
      });
  }
}


function addFunction() {
    const userTask = taskInput.value.trim();
    if (userTask) {
      const user = auth.currentUser;
      if (user) {
        const tasksRef = ref(db, `tasks/${user.uid}`);
        if (!isEditTask) {
          const newTaskRef = push(tasksRef);
          const taskInfo = { name: userTask, status: "pending" };
          update(newTaskRef, taskInfo);
        } else {
          const taskRef = ref(tasksRef, editId);
          update(taskRef, { name: userTask });
          isEditTask = false;
          editId = null;
        }
      }
      taskInput.value = "";
      showTodo(document.querySelector("span.active").id);
    }
  }
  
  
  function showTodo(filter) {
    let liTag = "";
    const user = auth.currentUser;
    if (user) {
      const tasksRef = ref(db, `tasks/${user.uid}`);
      get(tasksRef)
        .then((snapshot) => {
          const tasks = snapshot.val();
          if (tasks) {
            Object.entries(tasks).forEach(([id, task]) => {
              let completed = task.status === "completed" ? "checked" : "";
              if (filter === task.status || filter === "all") {
                liTag += `<li class="task">
                            <label for="${id}">
                              <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                              <p class="${completed}">${task.name}</p>
                            </label>
                            <div class="settings">
                              <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                              <ul class="task-menu">
                                <li onclick="editTask('${id}', '${task.name}')"><i class="uil uil-pen"></i>Edit</li>
                                <li onclick="deleteTask('${id}', '${filter}')"><i class="uil uil-trash"></i>Delete</li>
                              </ul>
                            </div>
                          </li>`;
                          
              }
            });
          }
          taskBox.innerHTML = liTag || `<span>You don't have any tasks here</span>`;
        })
        .catch((error) => {
          console.error("Error retrieving tasks:", error);
        });
    }
  }

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector("span.active").classList.remove("active");
      btn.classList.add("active");
      showTodo(btn.id);
    });
  });
  
  function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", (e) => {
      if (e.target.tagName !== "I" || e.target !== selectedTask) {
        menuDiv.classList.remove("show");
      }
    });
  }
  
  function updateStatus(selectedTask) {
    const taskId = selectedTask.id;
    const user = auth.currentUser;
    if (user) {
      const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
      if (selectedTask.checked) {
        update(taskRef, { status: "completed" });
      } else {
        update(taskRef, { status: "pending" });
      }
    }
  }
  
  function deleteTask(deleteId, filter) {
    isEditTask = false;
    const user = auth.currentUser;
    if (user) {
      const taskRef = ref(db, `tasks/${user.uid}/${deleteId}`);
      taskRef.remove()
        .then(() => {
          showTodo(filter);
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
        });
    }
  }
  addBtn.addEventListener("click", addFunction);



