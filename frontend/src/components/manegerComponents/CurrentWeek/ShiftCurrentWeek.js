import React, { useEffect, useState } from "react";
import styles from '../CreateWeek/createWeek.module.css'
import axios from 'axios';
import CurrentWeekWorkers from './CurrentWeekWorkers'
import Swal from 'sweetalert2';


const ShiftCurrentWeek = (props) => {

    const [shift, setShift] = useState(props.shift);
    const [showWorkers, setShow] = useState(true);
    const [addNewWorker, setNewWorker] = useState(false);
    const [newWorkers, setWorkers] = useState(null);

    const addWorkerShift = (workerId) => {
        const reqBody = {
            dayId: props.dayId,
            shiftId: shift._id,
            workerId: workerId
        }
        axios.put(`${process.env.REACT_APP_URL}/addWorkerToWorkrs`, reqBody)
            .then((response) => {
                console.log(response.data);
                props.setDay(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    const specialAdding = () => {

        const reqBody ={
            workers: [...shift.workers, ...shift.availableWorkers]
        }
        axios.post(`${process.env.REACT_APP_URL}/getAllWorkers`, reqBody).then(response => {
            console.log(response.data);
            setWorkers(response.data);
        }).then(() => {
            setNewWorker(true);
        }).catch(err => {
            console.log(err)
        });
    }

    const removeWorkerShift = (workerId) => {
        const reqBody = {
            dayId: props.dayId,
            shiftId: shift._id,
            workerId: workerId
        }
        axios.put(`${process.env.REACT_APP_URL}/WorkersToAvail`, reqBody)
            .then((response) => {
                props.setDay(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    const optionSelectedHandler = (event) => {
        addWorkerShift(event.target.value);
    }

    return <div>
        <div className={styles.shift} >
            <div onClick={() => {setShow(!showWorkers)}}>

                <button className={styles.plus_btn} onClick={() => {specialAdding()}}>+</button>
                {addNewWorker ? (
                newWorkers ?
                <select className={styles.select_choose_worker}
                onChange={(e) => optionSelectedHandler(e)}>
                
                    {newWorkers.map(elem => {
                        return <option value={elem._id}>{elem.fullName}</option>
                    })}

                </select> 
                : null)
                : null}

                <p className={styles.shift_description}>{shift.description}&nbsp;: {shift.endTime} - {shift.startTime}</p>
            </div>

            {showWorkers ?<CurrentWeekWorkers
                weekPublished={props.weekPublished}
                removeWorkerShift={removeWorkerShift}
                addWorkerShift={addWorkerShift}
                workers={shift.workers}
                availableWorkers={shift.availableWorkers}>   
            </CurrentWeekWorkers> : null}

        </div>
    </div>
}

export default ShiftCurrentWeek