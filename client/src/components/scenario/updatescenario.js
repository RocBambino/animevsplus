import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link, withRouter } from "react-router-dom";
import Spinner from '../isLoading/spinner';
import { Typeahead } from 'react-bootstrap-typeahead';
import Select from 'react-select';
import { Form, Col, Button, Alert, Modal } from 'react-bootstrap';
import { scenarioInitialState } from '../STATE';
import { updateScenario, saveScenario, deleteScenario } from '../../actions/scenarios';
import scenarios from '../../reducers/scenarios';

export const UpdateScenario = ({auth, history, updateScenario, deleteScenario}) => {
    const [universes, setUniverse] = useState({
        universe: [],
        loading: true
    });

    const [cards, setCard] = useState({
        card: [],
        loading: true
    });

    const [arms, setArm] = useState({
        arm: [],
        loading: true
    });

    const [scenarioData, setScenario] = useState({
        scenarios: [],
        loading: true
    })

    const [data, setData] = useState(scenarioInitialState);
    const [modalShow, setModalShow] = useState(false);
    const handleClose = () => setModalShow(false);
    const handleShow = () => setModalShow(true);
    const [validated, setValidated] = useState(false);
    const [show, setShow] = useState(false);

    const {
        TITLE,
        IMAGE,
        ENEMY_LEVEL,
        ENEMIES,
        EASY_DROPS,
        NORMAL_DROPS,
        HARD_DROPS,
        UNIVERSE,
    } = data;

    useEffect(() => {
        if(!auth.loading){
            axios.get('/crown/universes')
                .then((res) => {
                    setUniverse({universe: res.data, loading: false})
                })
            axios.get('/crown/cards')
                .then((res) => {
                    setCard({card: res.data, loading: false})
                })
            axios.get('/crown/arms')
                .then((res) => {
                    setArm({arm: res.data, loading: false})
                })
            axios.get('/crown/scenarios')
                .then((res) => {
                    setScenario({scenarios: res.data, loading: false})
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

    const isRaidHandler = (e) => {
        setData({
            ...data,
            IS_RAID: Boolean(e.target.value)
        })
    }


    if(!scenarioData.loading) {
        var scenarioSelector = scenarioData.scenarios.map(scenario => {
            return {
                value: scenario.TITLE, label: `${scenario.TITLE}`
            }
        })

        var scenarioHandler = (e) => {
            let value = e[0]
            scenarioData.scenarios.map(scenario => {
                if (e.value === scenario.TITLE) {
                    setData({
                        ...data,
                        TITLE: scenario.TITLE,
                        MUST_COMPLETE: scenario.MUST_COMPLETE,
                        IS_RAID: scenario.IS_RAID,
                        IMAGE: scenario.IMAGE,
                        ENEMY_LEVEL: scenario.ENEMY_LEVEL,
                        ENEMIES: scenario.ENEMIES,
                        EASY_DROPS: scenario.EASY_DROPS,
                        NORMAL_DROPS: scenario.NORMAL_DROPS,
                        HARD_DROPS: scenario.HARD_DROPS,
                        UNIVERSE: scenario.UNIVERSE
                    })
                }
            })
        }
    }

    var scenarioListHandler = (e) => {
        if(e != null){
            let value = e
            const scenarioList = [];
            for(const ti of value){
                if(!data.MUST_COMPLETE.includes(ti)){
                    scenarioList.push(ti.value)
                }
            }
            if(scenarioList){
                setData({
                    ...data,
                    MUST_COMPLETE: scenarioList,
                })
            }
            
        }
    }

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

        
    if(!arms.loading) {
        var armSelector = arms.arm.map(arm => {
            return {
                value: arm.ARM, label: `${arm.ARM}`
            }
        })
    
        var easyArmHandler = (e) => {
            if(e != null){
                let value = e
                const easyArmList = [];
                for(const a of value){
                    if(!data.EASY_DROPS.includes(a)){
                        easyArmList.push(a.value)
                    }
                }
                if(easyArmList){
                    setData({
                        ...data,
                        EASY_DROPS: easyArmList,
                    })
                }
                
            }
        }

        var normalArmHandler = (e) => {
            if(e != null){
                let value = e
                const normalArmList = [];
                for(const a of value){
                    if(!data.NORMAL_DROPS.includes(a)){
                        normalArmList.push(a.value)
                    }
                }
                if(normalArmList){
                    setData({
                        ...data,
                        NORMAL_DROPS: normalArmList,
                    })
                }
                
            }
        }

        var hardArmHandler = (e) => {
            if(e != null){
                let value = e
                const hardArmList = [];
                for(const a of value){
                    if(!data.HARD_DROPS.includes(a)){
                        hardArmList.push(a.value)
                    }
                }
                if(hardArmList){
                    setData({
                        ...data,
                        HARD_DROPS: hardArmList,
                    })
                }
                
            }
        }


    }

    if(!cards.loading) {
        var cardSelector = cards.card.map(card => {
            return {
                value: card.NAME, label: `${card.NAME}`
            }
        })

        var enemyHandler = (e) => {
            if(e != null){
                let value = e
                const enemyList = [];
                for(const e of value){
                    if(!data.ENEMIES.includes(e)){
                        enemyList.push(e.value)
                    }
                }
                if(enemyList){
                    setData({
                        ...data,
                        ENEMIES: enemyList,
                    })
                }
                
            }
        }

        var bannedCardsHandler = (e) => {
            if(e != null){
                let value = e
                const cardList = [];
                for(const c of value){
                    if(!data.BANNED_CARDS.includes(c)){
                        cardList.push(c.value)
                    }
                }
                if(cardList){
                    setData({
                        ...data,
                        BANNED_CARDS: cardList,
                    })
                }
                
            }
        }
    }

    const availableHandler = (e) => {
        setData({
            ...data,
            AVAILABLE: Boolean(e.target.value)
        })
    }


    console.log(data)
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
            console.log(data)
            const res = await updateScenario(data)

            setData(scenarioInitialState)
            setTimeout(()=> {setShow(true)}, 1000)
        }

    }

    const onDeleteHandler = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        const res = await deleteScenario(data);
        setModalShow(false);
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
                                        <Form.Group as={Col} md="6" controlId="validationCustom02">
                                            <Form.Label>Scenario Title</Form.Label>
                                            <Select
                                                onChange={scenarioHandler}
                                                options={
                                                    scenarioSelector
                                                }
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="validationCustom02">
                                            <Form.Label>Scenario Universe - {UNIVERSE}</Form.Label>
                                            <Select
                                                onChange={universeHandler}
                                                options={
                                                    universeSelector
                                                }
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            
                                        </Form.Group>

                                        <Form.Group as={Col} md="2" controlId="validationCustom02">
                                            <Form.Label>Enemy Level</Form.Label>
                                            <Form.Control
                                                value={ENEMY_LEVEL}
                                                name="ENEMY_LEVEL"
                                                onChange={onChangeHandler}
                                                required
                                                type="number"

                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            
                                        </Form.Group>                                        
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} md="12" controlId="validationCustom02">
                                            <Form.Label>Scenario Image URL</Form.Label>
                                            <Form.Control
                                                value={IMAGE}
                                                onChange={onChangeHandler}
                                                name="IMAGE"
                                                required
                                                type="text"

                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>

                                    </Form.Row>



                                    <Form.Row>
                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            <Form.Label>Scenario Enemies</Form.Label>
                                            <Select
                                                onChange={enemyHandler}
                                                isMulti
                                                options={cardSelector}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            <Form.Label>Easy Mode Arm Rewards</Form.Label>
                                            <Select
                                                onChange={easyArmHandler}
                                                isMulti
                                                options={armSelector}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
 
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            <Form.Label>Normal Mode Arm Rewards</Form.Label>
                                            <Select
                                                onChange={normalArmHandler}
                                                isMulti
                                                options={armSelector}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
 
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            <Form.Label>Hard Mode Arm Rewards</Form.Label>
                                            <Select
                                                onChange={hardArmHandler}
                                                isMulti
                                                options={armSelector}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
 
                                    </Form.Row>


                                    <Form.Row>
                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            <Form.Label>Easy Mode Card Rewards</Form.Label>
                                            <Select
                                                onChange={easyArmHandler}
                                                isMulti
                                                options={cardSelector}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
 
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            <Form.Label>Normal Mode Card Rewards</Form.Label>
                                            <Select
                                                onChange={normalArmHandler}
                                                isMulti
                                                options={cardSelector}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
 
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            <Form.Label>Hard Mode Card Rewards</Form.Label>
                                            <Select
                                                onChange={hardArmHandler}
                                                isMulti
                                                options={cardSelector}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
 
                                    </Form.Row>



                                    <Form.Row>
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
                                        <Form.Group as={Col} md="2" controlId="validationCustom02">
                                            <Form.Label> Is Raid? </Form.Label>
                                            
                                            <Form.Control
                                                as="select"
                                                id="inlineFormCustomSelectPref"
                                                onChange={isRaidHandler}
                                            >
                                                <option value={true} name="true">Yes</option>
                                                <option value={""} name="false">No</option>
                                            </Form.Control>
                                            
                                        </Form.Group>

                                    <Form.Row>

                                    </Form.Row>
                                    <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            <Form.Label>Must First Complete These Scenarios</Form.Label>
                                            <Select
                                                onChange={scenarioListHandler}
                                                isMulti
                                                options={scenarioSelector}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={styleSheet}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>

                                    </Form.Row>

                                    <Button type="submit">Update Scenario</Button>
                                    <br />
                                    <br />
                                    <Link to="/newscenario"><Button variant="outline-warning">New Scenario</Button></Link> 
                                    <br/>
                                    <br />
                                    {submission_alert_dom}

                                    <Button onClick={handleShow} as={Col} md="2" variant="danger">Delete</Button>

                                    <Modal show={modalShow} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                        <Modal.Title>Are you sure you want delete this Scenario?</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button variant="danger" onClick={onDeleteHandler}>
                                            Delete Scenario
                                        </Button>
                                        </Modal.Footer>
                                    </Modal>
                                    
                                    

                                </Form>

                            </div>

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

export default connect(mapStateToProps, {saveScenario, updateScenario, deleteScenario})(UpdateScenario)
