import React, { useEffect, useState, useRef } from "react";
import { Button , Input } from 'reactstrap';
import CreateTask from "../modals/createTask";
import Card from './Card';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { LuCheckCheck } from "react-icons/lu";


function TodoList(){
    
    //useState
    const [modal , setModal] = useState(false);
    const toggle = () => {
        setModal(!modal);
    }
    const [taskList , setTaskList] = useState([]);
    const [activeFilter, setActiveFilter] = useState('active');
    const cardContainerRef = useRef(null);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState(false);
    const [matchedCards, setMatchedCards] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    //Getting the task list and completed task list from local storage
    useEffect(() => {

        const storedTasks = JSON.parse(localStorage.getItem('Task List'));
        if(storedTasks){
            setTaskList(storedTasks);
        }

        const storedCompletedTasks = JSON.parse(localStorage.getItem('Completed Task List'));
        if (storedCompletedTasks) {
            setCompletedTasks(storedCompletedTasks);
        }

    },[])

    //Handling search
    const handleSearch = (e) =>{

        setSearchQuery(true);
        const query = e.target.value.toLowerCase();

        let matchedTasks = [];
        if (activeFilter === 'active') {
            matchedTasks = taskList.filter(task =>
                task.Name.toLowerCase().includes(query) || task.Description.toLowerCase().includes(query)
            );
        } else if (activeFilter === 'completed') {
            matchedTasks = completedTasks.filter(task =>
                task.Name.toLowerCase().includes(query) || task.Description.toLowerCase().includes(query)
            );
        }

        else { 
            const matchedTasksFromList = taskList.filter(task =>
                task.Name.toLowerCase().includes(query) || task.Description.toLowerCase().includes(query)
            );
            const matchedTasksFromCompleted = completedTasks.filter(task =>
                task.Name.toLowerCase().includes(query) || task.Description.toLowerCase().includes(query)
            );
            matchedTasks = [...matchedTasksFromList, ...matchedTasksFromCompleted];
        }

        setMatchedCards(matchedTasks);

    }
    
    //Handling filter change
    const handleFilterChange = (filter) => {

        setActiveFilter(filter);
        setMatchedCards([]);
        setSearchQuery(false);
        setSearchValue('');

    }

    //Handling search icon hover
    const handleSearchIconHover = () => {
        setIsExpanded(!isExpanded);
    }

    //Saving the task
    const saveTask = (taskObj) =>{

        let tempList = [...taskList];
        tempList.push(taskObj);
        setTaskList(tempList);

        //Setting the task list in local storage
        localStorage.setItem('Task List' , JSON.stringify(tempList));

        //Card animation
        if (cardContainerRef.current) {
            const newCard = cardContainerRef.current.lastChild;
            newCard.classList.add('slideInRight');
        }

    }

    //Deleting the single task
    const deleteTask = (index , isCompleted) =>{

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#271c6c",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            timer : 5000,
            showClass: {
              popup: 'animate__animated animate__zoomIn'
            },
            hideClass: {
              popup: 'animate__animated animate__zoomOut'
            }
          }).then((result) => {
            if (result.isConfirmed) {
                if(!isCompleted){
                    let updatedList = [...taskList];
                    updatedList.splice(index, 1);
                    setTaskList(updatedList);
                    localStorage.setItem('Task List', JSON.stringify(updatedList));
                }
                else{
                    let updatedCompletedTasks = [...completedTasks];
                    updatedCompletedTasks.splice(index, 1);
                    setCompletedTasks(updatedCompletedTasks);
                    localStorage.setItem('Completed Task List', JSON.stringify(updatedCompletedTasks));
                }
                toast.success('Task Deleted Successfully!');
            }
        });

    }
 
    //Updating list array
    const updateListArray = (updatedTaskObj , index) =>{

        let updatedList = [...taskList];
        updatedList[index] = updatedTaskObj;
        setTaskList(updatedList);
        localStorage.setItem('Task List' , JSON.stringify(updatedList));

    }

    //Completing the task
    const completeTask = (index) =>{

        let updatedList = [...taskList];
        updatedList[index].completed = true;
        setTaskList(updatedList);
    
        let completedTask = updatedList.splice(index, 1)[0];

        let updatedCompletedTasks = [...completedTasks, completedTask];
        setCompletedTasks(updatedCompletedTasks);
    
        localStorage.setItem('Task List', JSON.stringify(updatedList));
        localStorage.setItem('Completed Task List', JSON.stringify(updatedCompletedTasks));

        setActiveFilter('completed');

    }

    //Deleting all the tasks
    const deleteAllTasks = () =>{

        //Validators
        if (taskList.length === 0 && completedTasks.length === 0) {
            toast.error('No tasks available to delete.');
            return;
        }
        
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will delete all tasks. This cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#271c6c',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete all!',
            cancelButtonText: 'Cancel',
            timer : 5000,
            showClass: {
              popup: 'animate__animated animate__zoomIn'
            },
            hideClass: {
              popup: 'animate__animated animate__zoomOut'
            }
        }).then((result) => {
            if (result.isConfirmed) {

                localStorage.removeItem('Task List');
                localStorage.removeItem('Completed Task List');
                
                setTaskList([]);
                setCompletedTasks([]);

                toast.success('All tasks deleted successfully!');
                
            }
        });

    }

    //Completing all the tasks
    const completeAllTasks = () =>{

        // Check if there are no tasks
        if (taskList.length === 0 && completedTasks.length === 0) {
            toast.info('No tasks available to complete!');
            return;
        }
        
        //Validators
        const hasActiveTasks = taskList.some(task => !task.completed);

        if (!hasActiveTasks) {
            toast.info('All tasks are already completed!');
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will mark all active tasks as done. Continue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#271c6c',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, complete all!',
            cancelButtonText: 'Cancel',
            timer : 5000,
            showClass: {
              popup: 'animate__animated animate__zoomIn'
            },
            hideClass: {
              popup: 'animate__animated animate__zoomOut'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedTaskList = taskList.map(task => {
                    if (!task.completed) {
                        return { ...task, completed: true };
                    } else {
                        return task;
                    }
                });
    
                const updatedCompletedTasks = [...completedTasks, ...updatedTaskList.filter(task => task.completed)];
    
                setCompletedTasks(updatedCompletedTasks);
                setTaskList([]);

                localStorage.setItem('Task List', JSON.stringify([]));
                localStorage.setItem('Completed Task List', JSON.stringify(updatedCompletedTasks));
    
                toast.success('All tasks marked as completed!');

            }
        });

    }
    

    return(
       <>
            <div className="header text-center">
                <h3 className="todo_list">Todo List</h3>
                <Button className="mt-2 standard_btn major_btns" onClick={() => setModal(true)}>Create Task</Button>
            </div>

            <div className="task-container" ref={cardContainerRef}>
                <div className="main-container">
                    
                    <div className="button-container">
                        <Button
                            className={`custom-button ${activeFilter === 'active' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('active')}
                        >
                            Active
                        </Button>
                        <Button
                            className={`custom-button ${activeFilter === 'completed' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('completed')}
                        >
                            Completed
                        </Button>
                        <Button
                            className={`custom-button ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('all')}
                        >
                            All
                        </Button>
                    </div>

                    <div className="search-icon-container" onMouseEnter={handleSearchIconHover} onMouseLeave={handleSearchIconHover}>
                        <Input
                            type="text"
                            placeholder="Search..."
                            className={`search-input ${isExpanded ? 'expanded' : ''}`}
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                handleSearch(e);
                            }}
                            disabled={taskList.length === 0 && completedTasks.length === 0}
                        />
                        <Button className={`search-button ${isExpanded ? 'expanded' : ''}`}><FaSearch className="search_icon" /></Button>
                    </div>
                </div>

                <div className="task-wrapper">

                    { matchedCards.length > 0 && activeFilter === 'active' ? (
                        matchedCards.map((obj, index) => (
                            <Card key={index} taskObj={obj} index={index} deleteTask={deleteTask} updateListArray={updateListArray} completeTask={completeTask} />
                        ))
                        ) : (
                            activeFilter === 'active' && matchedCards.length === 0 && searchQuery === true ? (
                                <p style={{ marginLeft: 'auto', marginRight: 'auto', color: '#271c6c' }}>No matched tasks found.</p>
                            ) : (
                                activeFilter === 'active' && taskList.length === 0 ? (
                                    <p style={{ marginLeft: 'auto', marginRight: 'auto', color: '#271c6c' }}>No active tasks available.</p>
                                ) : (
                                    activeFilter === 'active' && taskList.filter(task => !task.completed).map((obj, index) => (
                                        <Card key={index} taskObj={obj} index={index} deleteTask={deleteTask} updateListArray={updateListArray} completeTask={completeTask} />
                                    ))
                                )
                            )
                        )
                    }

                    { matchedCards.length > 0 && activeFilter === 'completed' ? (
                        matchedCards.map((obj, index) => (
                            <Card key={index} taskObj={obj} index={index} deleteTask={deleteTask} updateListArray={updateListArray} completeTask={completeTask} isCompleted={true}/>
                        ))
                        ) : (
                            activeFilter === 'completed' && matchedCards.length === 0 && searchQuery === true ? (
                                <p style={{ marginLeft: 'auto', marginRight: 'auto', color: '#271c6c' }}>No matched tasks found.</p>
                            ) : (
                                activeFilter === 'completed' && completedTasks.length === 0 ? (
                                    <p style={{ marginLeft: 'auto', marginRight: 'auto', color: '#271c6c' }}>No completed tasks available.</p>
                                ) : (
                                    activeFilter === 'completed' && completedTasks.map((obj, index) => (
                                        <Card key={index} taskObj={obj} index={index} deleteTask={deleteTask} updateListArray={updateListArray} isCompleted={true} />
                                    ))
                                )
                            )
                        )
                    }

                    { matchedCards.length > 0 && activeFilter === 'all' ? (
                        matchedCards.map((obj, index) => (
                                <Card key={index} taskObj={obj} index={index} deleteTask={deleteTask} updateListArray={updateListArray} completeTask={completeTask} />
                            ))
                        ) : (
                            activeFilter === 'all' && matchedCards.length === 0 && searchQuery === true ? (
                                <p style={{ marginLeft: 'auto', marginRight: 'auto', color: '#271c6c' }}>No matched tasks found.</p>
                            ) : (
                                activeFilter === 'all' && taskList.length === 0 && completedTasks.length === 0  ? (
                                    <p style={{ marginLeft: 'auto', marginRight: 'auto', color: '#271c6c' }}>No tasks available.</p>
                                ) : (
                                    activeFilter === 'all' && (
                                        <>
                                            {taskList.map((obj, index) => (
                                                <Card key={index} taskObj={obj} index={index} deleteTask={deleteTask} updateListArray={updateListArray} completeTask={completeTask} />
                                            ))}
                                            {completedTasks.map((obj, index) => (
                                                <Card key={index} taskObj={obj} index={index} deleteTask={deleteTask} updateListArray={updateListArray} />
                                            ))}
                                        </>
                                    )
                                )
                            )
                        )
                    }

                </div>

            </div>

            <div className="floating-action-buttons">
                <button className="delete-btn">
                    <RiDeleteBin2Line onClick={deleteAllTasks} title="DeleteAll?"/>
                </button>
                <button className="complete-btn">
                    <LuCheckCheck onClick={completeAllTasks} title="CompleteAll"/>
                </button>
            </div>

            <CreateTask toggle = {toggle} modal = {modal} saveTask = {saveTask}/>
       </>
    )
}

export default TodoList;