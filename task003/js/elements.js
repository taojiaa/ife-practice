define(['utils'], function (util) {

    function createTaskCategory(name, level) {
        return {
            name: name,
            level: level,
            id: Date.now(),
            subTasks: {},
            subTaskCategories: {},
            parent: null
        };
    }

    function createTask(name) {
        return {
            name: name,
            date: util.getTodayString(),
            content: null,
            finished: false,
            id: Date.now()
        }
    }

    function addTaskCategory(taskCategory, name) {
        let newItem = createTaskCategory(name, taskCategory.level + 1);
        newItem.parent = taskCategory;
        taskCategory.subTaskCategories[newItem.id] = newItem;
        return newItem;
    }


    function addTask(taskCategory, name) {
        let newItem = createTask(name);
        newItem.parent = this;
        taskCategory.subTasks[newItem.id] = newItem;
        return newItem;
    }

    function taskCategoryRemove(taskCategory) {
        if (!taskCategory.parent) {
            return;
        }
        delete taskCategory.parent.subTaskCategories[taskCategory.id];
    }

    function getUnFinished(taskCategory) {
        let count = 0;
        for (let task of Object.values({ ...taskCategory.subTasks, ...taskCategory.subTaskCategories })) {
            let addNum;
            if ("subTaskCategories" in task) {
                addNum = getUnFinished(task);
            } else {
                addNum = +!task.finished
            }
            count += addNum;
        }
        return count;
    }

    function finish(task) {
        task.finished = true;
        return task;
    }

    function taskRemove(task) {
        if (!task.parent) {
            return;
        }
        delete task.parent.subTasks[task.id];
    }

    const taskCategoryMethods = {
        createTaskCategory,
        addTaskCategory,
        addTask,
        getUnFinished,
        taskCategoryRemove
    }

    const taskMethods = {
        createTask,
        finish,
        taskRemove
    }

    return {
        taskCategoryMethods,
        taskMethods
    };
})