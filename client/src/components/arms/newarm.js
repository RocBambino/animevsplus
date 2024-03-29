import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link, withRouter } from "react-router-dom";
import Spinner from '../isLoading/spinner';
import { Typeahead } from 'react-bootstrap-typeahead';
import Select from 'react-select';
import { Form, Col, Button, Alert } from 'react-bootstrap';
import { armInitialState, arm_enhancements, elements, drop_styles } from '../STATE'
import { saveArm } from '../../actions/arms'

export const NewArm = ({auth, history, saveArm}) => {
    const [universes, setUniverse] = useState({
        universe: [],
        loading: true
    });
    const [data, setData] = useState(armInitialState);
    const [validated, setValidated] = useState(false);
    const [show, setShow] = useState(false);
    const [ability, setAbility] = useState({
        POWER: 20,
        ABILITY_TYPE: ""
    });
    // Build ability
    var pass_power = ability.POWER
    var pass_type = ability.ABILITY_TYPE
    var abililty_Object = {}
    abililty_Object[pass_type] = pass_power

    const {
        ARM,
        PRICE,
        ABILITIES,
        UNIVERSE,
        AVAILABLE,
        ELEMENT,
        DROP_STYLE,
        ID
    } = data;
    
    useEffect(() => {
        if(!auth.loading){
            axios.get('/crown/universes')
                .then((res) => {
                    setUniverse({universe: res.data, loading: false})
                })
        }
      }, [auth])

    const onChangeHandler = (e) => {
        setShow(false)
        if (e.target.type === "number"){
            setData({
                ...data,
                [e.target.name]: e.target.valueAsNumber
            })
        } else {
            setData({
                ...data,
                [e.target.name]: e.target.value
            })
        }
        
    }

    const availableHandler = (e) => {
        setData({
            ...data,
            AVAILABLE: Boolean(e.target.value)
        })
    }

    const abilityHandler = (e) => {
        if (e.target.type === "number"){
            setAbility({
                ...ability,
                [e.target.name]: e.target.valueAsNumber
            })
        } 
    }

    var dropStyleHandler = (e) => {
        let value = e[0]
        drop_styles.map(drop => {
            if (e.value === drop) {
                setData({
                    ...data,
                    DROP_STYLE: drop,
                })
            }
        })
    };

    if(!universes.loading) {
        var universeSelector = universes.universe.map(universe => {
            return {
                value: universe.TITLE, label: `${universe.TITLE}`
            }
        })

        var universeHandler = (e) => {
            let value = e[0]
            universes.universe.map(universe => {
                if (e.value === universe.TITLE) {
                    setData({
                        ...data,
                        UNIVERSE: universe.TITLE,
                    })
                }
            })
        }
    }

    var enhancementSelector = arm_enhancements.map(enhancement => {
        return {
            value: enhancement, label: `${enhancement}`
        }
    })

    var elementSelector = elements.map(element => {
        return {
            value: element, label: `${element}`
        }
    })

    var dropStyleSelector = drop_styles.map(drop => {
        return {
            value: drop, label: `${drop}`
        }
    });

    var elementEnhancementHandler = (e) => {
        let value = e[0]
        elements.map(element => {
            if (e.value === element) {
                setData({
                    ...data,
                    ELEMENT: element,
                })
            }
        })
    }


    console.log(data)
    var abilityEnhancementHandler = (e) => {
        let value = e[0]
        arm_enhancements.map(enhancement => {
            if (e.value === enhancement) {
                setAbility({
                    ...ability,
                    ABILITY_TYPE: enhancement,
                })
            }
        })

    }
    
    var submission_response = "Success!";
    var submission_alert_dom = <Alert show={show} variant="success"> {submission_response} </Alert>
    const onSubmitHandler = async (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setShow(false)
            setValidated(true);
        } else {
            setValidated(false)
            e.preventDefault();
            const min = 1000000; // Minimum 7-digit number (inclusive)
            const max = 9999999; // Maximum 7-digit number (inclusive)
            const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
            var arm_update_data = data;
            arm_update_data.ABILITIES = [abililty_Object]
            setData({
                ...data,
                ID: randomCode.toString()
            })
            // console.log(arm_update_data)
            const res = await saveArm(data)

            setData(armInitialState)
            setTimeout(()=> {setShow(true)}, 1000)
        }

    }

    const styleSheet = {
        input: (base, state) => ({
            ...base,
            color: 'white'

        })
    };
    return auth.loading || universes.loading ? (
        <Spinner />
    ) : (
            <div>
                <div className="page-header">
                    <h3 className="page-title">
                        New Crown Unlimited Arm
                    </h3>
                </div>
                <div className="row">
                    <div className="col-md-12 grid-margin">
                        <div className="card">
                            <div className="card-body">
                                <Form noValidate validated={validated} onSubmit={onSubmitHandler}>
                                    <Form.Row>
                                        <Form.Group as={Col} md="4" controlId="validationCustom01">
                                            <Form.Label>Select Universe</Form.Label>
                                            <Select
                                                onChange={universeHandler}
                                                options={
                                                    universeSelector
                                                }
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md="4" controlId="validationCustom02">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                value={ARM}
                                                onChange={onChangeHandler}
                                                name="ARM"
                                                required
                                                type="text"
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} md="4" controlId="validationCustom02">
                                            <Form.Label>Drop Style</Form.Label>
                                            <Select
                                                onChange={dropStyleHandler}
                                                options={
                                                    dropStyleSelector
                                                }
                                                required
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} md="2" controlId="validationCustom02">
                                            <Form.Label>Power</Form.Label>
                                            <Form.Control
                                                value={ability.POWER}
                                                name="POWER"
                                                onChange={abilityHandler}
                                                required
                                                type="number"

                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="validationCustom02">
                                        <Form.Label>Type</Form.Label>
                                            <Select
                                                onChange={abilityEnhancementHandler}
                                                options={
                                                    enhancementSelector
                                                }
                                                required
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="validationCustom02">
                                        <Form.Label>Element</Form.Label>
                                            <Select
                                                onChange={elementEnhancementHandler}
                                                options={
                                                    elementSelector
                                                }
                                                required
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            
                                        </Form.Group>

                                        <Form.Group as={Col} md="2" controlId="validationCustom02">
                                            <Form.Label> Available </Form.Label>
                                            <Form.Control
                                                as="select"
                                                id="inlineFormCustomSelectPref"
                                                onChange={availableHandler}
                                            >
                                                <option value={true} name="true">Yes</option>
                                                <option value={""} name="false">No</option>
                                            </Form.Control>
                                            
                                            </Form.Group>
                                    </Form.Row>
                                    <Button type="submit">Create Arm</Button>
                                    <br />
                                    <br />
                                    {auth.user.data.IS_ADMIN ? 
                                    <Link to="/updatearms"><Button variant="warning">Update Arm</Button></Link> 
                                    : <span></span>
                                    }
                                    <br/>
                                    <br />
                                    {submission_alert_dom}
                                    
                                    

                                </Form>

                            </div>

                            {/* <Alerts /> */}
                        </div>
                    </div>
                </div>
            </div>
        )
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    cards: state.cards
})

export default connect(mapStateToProps, {saveArm})(NewArm)
