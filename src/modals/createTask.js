import React, { useState , useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import { toast } from 'react-toastify';


function CreateTask({modal , toggle , saveTask}){

    //useState
    const [taskName , setTaskName] = useState('');
    const [taskDescription , setTaskDescription] = useState('');

    //Reset task name and description when modal opens or closes
    useEffect(() => {

        if (!modal) {
            setTaskName('');
            setTaskDescription('');
        }

    }, [modal]);
    
    //Handling change function
    const  handleChange = (e) =>{

        const {name , value} = e.target;

        if(name === 'taskName'){
            setTaskName(value);
        }
        else{
            setTaskDescription(value);
        }

    }

    //Handling create function
    const handleCreate = () =>{

        //Validators
        if(!taskName || !taskDescription){
            toast.error('Please fill all fields.');
            toggle();
            return;
        }
        
        //Saving task object
        let taskObj = {
            Name: taskName,
            Description: taskDescription
        };

        saveTask(taskObj);
        toggle();
        toast.success('Task created successfully!');
        
        setTaskName('');
        setTaskDescription('');
        
    }

    return (
        <Modal isOpen={modal} toggle={toggle} className="animate__animated animate__rotateIn">
            <ModalHeader className="modal_heading" toggle={toggle}>Create Task</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label>
                            Task Name
                        </Label>
                        <Input
                            type="text"
                            value={taskName}
                            onChange={handleChange}
                            name="taskName"
                            placeholder="Enter Task Name"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>
                            Task Description
                        </Label>
                        <textarea 
                            rows="5" 
                            className="form-control"
                            value={taskDescription}
                            onChange={handleChange}
                            name="taskDescription"
                            placeholder="Enter Task Description"
                            style={{resize : 'none'}}
                            maxLength={50}
                        ></textarea>
                        <small className={taskDescription.length > 50 ? 'text-danger' : 'text-muted'}>
                            {taskDescription.length} / 50 characters
                        </small>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button className="standard_btn" onClick={handleCreate}>
                    Create
                </Button>
                <Button className="close_btn" onClick={toggle}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default CreateTask;