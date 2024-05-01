import React, { useState , useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import { toast } from 'react-toastify';
import '../modals/Modal.css';


function CreateTask({ modal , toggle , saveTask }){

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

        //Input field validation message
        if (!taskName.trim() || !taskDescription.trim()) {
            if (!taskName.trim() && !taskDescription.trim()) {
                toast.error('Task Name and Description are required.');
            } else if (!taskName.trim()) {
                toast.error('Task Name is required.');
            } else {
                toast.error('Task Description is required.');
            }
            return;
        }
        
        //Saving task object
        const savedSuccessfully = saveTask({
            Name: taskName,
            Description: taskDescription
        });

        //Validating for duplicate entry of task name alone
        if (savedSuccessfully) {
            toggle();
            toast.success('Task created successfully!');
            setTaskName('');
            setTaskDescription('');
        } else {
            toggle();
        }
        
        
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
                            autoComplete="off"
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
                        <small className='text-danger'>
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