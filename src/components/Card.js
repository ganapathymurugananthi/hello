import React , {useState} from "react";
import { MdOutlineDeleteOutline , MdCheck } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import EditTask from "../modals/EditTask";
import './Card.css';


function Card({taskObj , index , deleteTask , updateListArray , completeTask}){

    //useState 
    const [modal , setModal] = useState(false);
    const toggle = () => {
        setModal(!modal);
    }

    //Handling completed
    const handleCompleted = () =>{
        completeTask(index);
    }

    //Updating the task
    const updateTask = (updatedTaskObj) =>{
        updateListArray(updatedTaskObj, index)
    }

    //Handling delete
    const handleDelete = (isCompleted) =>{
        deleteTask(index, isCompleted);
    }
    

    return(

        <>
            <div className="card_container">
                <div className="card">

                    <div className="card-header">
                        {taskObj.completed ? <p className="done_card">DONE</p> : <p className="active_card">Active</p>}
                    </div>

                    <div className="card-body">
                        <h6>{taskObj.Name}</h6>
                        <small className="text-truncate" style={{ maxWidth : '60%'}}>{taskObj.Description}</small>
                    </div>

                    <div className="card-footer">
                        <div className="footer_icons">
                            {!taskObj.completed && (
                                <>
                                    <FiEdit2 className="edit_icon" style={{ fontSize: '25px' }} onClick={() => setModal(true)} />
                                    <MdCheck className="check_icon" style={{ fontSize: '30px' }} onClick={handleCompleted} />
                                </>
                            )}
                            <MdOutlineDeleteOutline className="delete_icon" style={{ fontSize: '20px' }} onClick={() => handleDelete(taskObj.completed)} />
                        </div>
                    </div>
                </div>

                <EditTask modal={modal} toggle={toggle} updateTask={updateTask} taskObj={taskObj} />
                
            </div>
        </>
    )
}

export default Card;