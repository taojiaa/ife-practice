define(['elements', 'utils'], function (elements, utils) {

    function bindAllEvents(manager) {
        let { loadTree, insertAfter, filterObjectByValue, delegateEvent } = utils,
            { taskCategoryMethods, taskMethods } = elements;

        let currentLeftFocusId = 'left';

        let leftDom = document.getElementById('left');
        let listDom = document.getElementById('category-list');
        let taskDom = document.getElementById('task-list');
        let rightDom = document.getElementById('right');
        let addCategoryButton = document.getElementById('add-category');
        let addTaskButton = document.getElementById('add-task');

        let getTaskInDates = function (subTasks) {
            taskInDates = {}
            for (let task of Object.values(subTasks)) {
                if (task.date in taskInDates) {
                    taskInDates[task.date].push(task);
                } else {
                    taskInDates[task.date] = [task];
                }
            }
            return taskInDates;
        }

        let renderTaskList = function (taskInDates) {
            taskDom.innerHTML = "";
            if (Object.keys(taskInDates).length !== 0) {
                let fragment = document.createDocumentFragment();
                for (let [date, tasks] of Object.entries(taskInDates)) {
                    let dateEle = document.createElement('li');
                    dateEle.className = "task-date";
                    dateEle.textContent = date;
                    fragment.appendChild(dateEle);
                    for (task of tasks) {
                        let taskEle = document.createElement('li');
                        taskEle.className = "task";
                        taskEle.textContent = task.name;
                        taskEle.id = task.id;
                        fragment.appendChild(taskEle);
                    }
                }
                taskDom.appendChild(fragment);
            }
        }

        let refreshUnfinishedCount = function (id) {
            let render = function (id) {
                taskCategory = manager[id];
                taskCategoryEle = document.getElementById(id).firstElementChild;
                taskCategoryEle.textContent = `${taskCategory.name} (${taskCategoryMethods.getUnFinished(taskCategory)})`;
            }

            render(id);

            let curLevel = manager[id].level;
            let ele = document.getElementById(id).previousElementSibling;
            let eleList = [];

            while (ele !== null && ele.classList.contains('category')) {
                eleList.push(ele);
                ele = ele.previousElementSibling;
            }
            for (let ele of eleList) {
                nextLevel = manager[ele.id].level;
                if (nextLevel === curLevel - 1) {
                    render(ele.id);
                    curLevel = nextLevel;
                }
            }
        }

        let renderTask = function (task) {
            rightDom.innerHTML = "";

            // add task page elements
            let taskPage = document.createElement('div');
            let taskContent = document.createElement('div');

            taskPage.className = "detail-task-page";
            taskContent.className = "detail-task-content";
            taskContent.textContent = task.content;

            // add taskName box
            let taskName = document.createElement('div');
            taskName.className = "detail-task-name";

            let nameEle = document.createElement('span');
            let editEle = document.createElement('span');
            let finishEle = document.createElement('span');
            nameEle.className = "single-line";
            editEle.className = "detail-edit";
            finishEle.className = "detail-finish";

            nameEle.textContent = task.name;
            editEle.textContent = 'Edit';
            finishEle.textContent = 'Finish';
            taskName.appendChild(nameEle);
            taskName.appendChild(editEle);
            taskName.appendChild(finishEle);

            // add taskDate box
            let taskDate = document.createElement('div');
            taskDate.className = "detail-task-date";

            let dateTitleEle = document.createElement('span');
            let dateEle = document.createElement('span');
            dateEle.className = "single-line";
            dateTitleEle.textContent = "Task Date: "
            dateEle.textContent = task.date;
            taskDate.appendChild(dateTitleEle);
            taskDate.appendChild(dateEle);

            // bind edit and finish button;
            finishEle.addEventListener('click', function (event) {
                task.finish();
                refreshUnfinishedCount(currentLeftFocusId);
            })

            editEle.addEventListener('click', function (event) {
                nameEle.contentEditable = true;
                taskContent.contentEditable = true;
            })

            nameEle.addEventListener("input", function (event) {
                task.name = event.target.textContent;
            });

            taskContent.addEventListener("input", function (event) {
                task.content = event.target.textContent;
            });

            // append to the dom
            for (let item of [taskName, taskDate, taskContent]) {
                taskPage.appendChild(item);
            }
            rightDom.appendChild(taskPage);
        }

        let plotTaskCategory = function (item) {
            let li = document.createElement('li');
            li.className = 'category';
            li.id = item.id;
            li.style.paddingLeft = 15 * (item.level + 1) + 'px';

            let span = document.createElement('span');
            span.textContent = `${item.name} (${taskCategoryMethods.getUnFinished(item)})`;
            li.appendChild(span);

            li.addEventListener('click', function (event) {
                // change the focus color
                loadTree(listDom, function (child) {
                    child.style.backgroundColor = 'rgb(' + 235 + ',' + 235 + ',' + 235 + ')';
                })
                this.style.backgroundColor = 'white';
                this.childNodes.forEach(node => node.style.backgroundColor = 'white');
                // set up the currentLeftId
                currentLeftFocusId = li.id;
                addTaskButton.disabled = false;

                // render all tasks belongs to this category.
                renderTaskList(getTaskInDates(item.subTasks));

                event.stopPropagation();
            })

            li.addEventListener("mouseover", function (event) {
                let self = this;
                if (this.lastElementChild.className === 'delete') {
                    return;
                }
                let deleteEle = document.createElement('span');
                deleteEle.textContent = '✖️';
                deleteEle.className = 'delete';
                this.appendChild(deleteEle);

                deleteEle.addEventListener('click', function (event) {
                    let result = confirm('Are you sure you want to delete this category?');
                    if (result) {
                        // delete from the manager database
                        taskCategoryMethods.taskCategoryRemove(manager[self.id]);
                        delete manager[self.id];
                        // refresh the unfinished count
                        if (self.previousElementSibling !== null & self.previousElementSibling.classList.contains('category')) {
                            refreshUnfinishedCount(self.previousElementSibling.id);
                        }
                        // clear the mid and right page
                        if (self.id === currentLeftFocusId) {
                            //TODO taskDom cannot be removed
                            taskDom.innerHTML = "";
                            rightDom.innerHTML = "";
                        }
                        // delete the element
                        self.remove();
                    }
                })
            })

            li.addEventListener("mouseout", function (event) {
                if (event.relatedTarget.parentNode !== this) {
                    this.removeChild(this.lastElementChild);
                }
            })

            return li;
        }

        // render default category
        listDom.appendChild(plotTaskCategory(manager[0]));

        // bind Left:category-list
        leftDom.addEventListener('click', function () {
            loadTree(listDom, function (child) {
                child.style.backgroundColor = 'rgb(' + 235 + ',' + 235 + ',' + 235 + ')';
            })
            currentLeftFocusId = 'left';
            addTaskButton.disabled = true;
        })


        // bind Left:add-category
        addCategoryButton.addEventListener('click', function () {
            let name = prompt("The name of your new category?");
            if (!name) {
                return;
            }
            let parentDom, newTaskCategory;
            if (currentLeftFocusId === 'left') {
                newTaskCategory = taskCategoryMethods.createTaskCategory(name, 0);
                parentDom = listDom.lastElementChild;
            } else {
                let parent = manager[currentLeftFocusId];
                newTaskCategory = taskCategoryMethods.addTaskCategory(parent, name);
                parentDom = document.getElementById(currentLeftFocusId);
            }
            insertAfter(plotTaskCategory(newTaskCategory), parentDom);
            manager[newTaskCategory.id] = newTaskCategory;
        })

        // bind Mid:add-category
        addTaskButton.addEventListener('click', function () {
            let name = prompt("The name of your new task?");
            let parent = manager[currentLeftFocusId];
            let newTask = taskCategoryMethods.addTask(parent, name);
            renderTaskList(getTaskInDates(parent.subTasks));
            refreshUnfinishedCount(currentLeftFocusId);
        })

        // bind Mid: tags
        let tags = document.querySelectorAll('input[name="tags"]');
        tags.forEach(elem => {
            elem.addEventListener('change', function (event) {
                rightDom.innerHTML = "";
                let value = event.target.value;
                if (currentLeftFocusId === 'left') {
                    return;
                }
                let parent = manager[currentLeftFocusId];
                let subTasks;

                switch (value) {
                    case 'unfinished':
                        subTasks = filterObjectByValue(parent.subTasks, item => !item.finished);
                        break;
                    case 'finished':
                        subTasks = filterObjectByValue(parent.subTasks, item => item.finished);
                        break;
                    default:
                        subTasks = parent.subTasks;
                }
                renderTaskList(getTaskInDates(subTasks));
            })
        });

        // bind Mid: tasks
        delegateEvent(taskDom, 'click', target => target.className === 'task', function () {
            let taskCategory = manager[currentLeftFocusId];
            let task = taskCategory.subTasks[this.id];
            this.style.color = 'green';
            renderTask(task);
        })
    }

    return { bindAllEvents };
})
