import React, { useState , useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';
import { toast } from 'react-toastify';


function EditTask({ modal , toggle , updateTask , taskObj }){

    //useState
    const [taskName , setTaskName] = useState('');
    const [taskDescription , setTaskDescription] = useState('');

    //Handling task name and description
    useEffect(() => {
        if (taskObj) {
            setTaskName(taskObj.Name || '');
            setTaskDescription(taskObj.Description || '');
        }
    }, [taskObj]);
    
    //Handling change function
    const handleChange = (e) =>{

        const {name , value} = e.target;

        if(name === 'taskName'){
            setTaskName(value);
        }
        else{
            setTaskDescription(value);
        }
    }

    //Handling update function
    const handleUpdate = () =>{

        //Validators
        if (taskName === taskObj.Name && taskDescription === taskObj.Description) {
            toast.info('No changes found.');
            toggle();
            return;
        }

        //Updating task obj
        const updatedTaskObj = {
            Name: taskName,
            Description: taskDescription
        };

        updateTask(updatedTaskObj);
        toggle();
        toast.success('Task Updated Successfully!');
        
    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Update Task</ModalHeader>
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
                        ></textarea>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button className="standard_btn" onClick={handleUpdate}>
                    Update
                </Button>
                <Button className="close_btn" onClick={toggle}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default EditTask;