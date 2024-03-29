import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import Spinner from '../isLoading/spinner';
import Select from 'react-select';
import { Form, Col, Button, Alert } from 'react-bootstrap';
import { titleInitialState, enhancements, unlock_methods, elements, title_abilities, title_explanations } from '../STATE';
import { saveTitle } from '../../actions/titles';

export const NewTitle = ({ auth, history, saveTitle }) => {
    const [universeList, setUniverseList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(titleInitialState);
    const [validated, setValidated] = useState(false);
    const [show, setShow] = useState(false);
    const [abilities, setAbilities] = useState([{ ABILITY: "", POWER: 0, ELEMENT: "", DURATION: 0 }]);
    
    useEffect(() => {
        if (!auth.loading) {
            axios.get('/crown/universes')
                .then((res) => {
                    setUniverseList(res.data);
                    setIsLoading(false);
                });
        }
    }, [auth]);

    const onChangeHandler = (e) => {
        const { type, name, value, valueAsNumber } = e.target;
        let newValue = type === "number" ? valueAsNumber : value;
        if(name === "unlock-value") {
            setData(prevData => ({ ...prevData, UNLOCK_METHOD: { ...prevData.UNLOCK_METHOD, VALUE: newValue, SCENARIO_DROP: false }}));
        } else {
            setData(prevData => ({ ...prevData, [name]: newValue }));
        }
    }

    const handleSelectorChange = (selectedOption, actionMeta) => {
        if (actionMeta.name === "universe") {
            setData(prevData => ({ ...prevData, UNIVERSE: selectedOption.value }));
        } else if (actionMeta.name.startsWith("ability-")) {
            const index = parseInt(actionMeta.name.split("-")[1]);
            const updatedAbilities = [...abilities];
            updatedAbilities[index][actionMeta.name.split("-")[2]] = selectedOption.value;
            setAbilities(updatedAbilities);
        } else if (actionMeta.name === "unlock-method") {
            setData(prevData => ({ ...prevData, UNLOCK_METHOD: { ...prevData.UNLOCK_METHOD, METHOD: selectedOption.value }}));
        } else if (actionMeta.name === "unlock-element") {
            setData(prevData => ({ ...prevData, UNLOCK_METHOD: { ...prevData.UNLOCK_METHOD, ELEMENT: selectedOption.value }}));
        }
    }

    console.log(data)

    var submission_response = "Success!";
    var submission_alert_dom = <Alert show={show} variant="success"> {submission_response} </Alert>
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setShow(false)
            setValidated(true);
        } else {
            setValidated(false);
            e.preventDefault();
            const updatedData = { ...data, ABILITIES: abilities, ID: Math.floor(Math.random() * 10000000).toString() };
            console.log(data)
            const res = await saveTitle(updatedData);
            setData(titleInitialState);
            setAbilities([{ ABILITY: "", POWER: 0, ELEMENT: "", DURATION: 0 }]);
            setTimeout(() => { setShow(true) }, 1000);
        }
    }

    const styleSheet = {
        input: base => ({ ...base, color: 'white' })
    };

    const universeOptions = universeList.map(universe => ({ value: universe.TITLE, label: universe.TITLE }));
    const titleAbilityOptions = title_abilities.map(ability => ({ value: ability, label: ability }));
    const enhancementOptions = enhancements.map(enhancement => ({ value: enhancement, label: enhancement }));
    const unlockMethodsOptions = unlock_methods.map(method => ({ value: method, label: method }));
    const elementsOptions = elements.map(element => ({ value: element, label: element }));

    return auth.loading ? (
        <Spinner />
    ) : (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    New Title
                </h3>
            </div>
            <div className="row">
                <div className="col-md-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <Form noValidate validated={validated} onSubmit={onSubmitHandler}>
                                <Form.Row>
                                    <Form.Group as={Col} md="6" controlId="validationCustom01">
                                        <Form.Label>Select Universe</Form.Label>
                                        <Select
                                            onChange={handleSelectorChange}
                                            options={universeOptions}
                                            styles={styleSheet}
                                            name="universe"
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" controlId="validationCustom02">
                                        <Form.Label>Title Name</Form.Label>
                                        <Form.Control
                                            value={data.TITLE}
                                            onChange={onChangeHandler}
                                            name="TITLE"
                                            required
                                            type="text"
                                        />
                                    </Form.Group>
                                </Form.Row>
                                {abilities.map((ability, index) => (
                                    <div key={index}>
                                        <Form.Row>
                                            <Form.Group as={Col} md="3">
                                                <Form.Label>Ability</Form.Label>
                                                <Select
                                                    onChange={handleSelectorChange}
                                                    options={titleAbilityOptions}
                                                    name={`ability-${index}-ABILITY`}
                                                    value={{ value: ability.ABILITY, label: ability.ABILITY }}
                                                />                                                    
                                            </Form.Group>
                                            <Form.Group as={Col} md="3">
                                                <Form.Label>Power</Form.Label>
                                                <Form.Control
                                                    value={ability.POWER}
                                                    onChange={(e) => {
                                                        const updatedAbilities = [...abilities];
                                                        updatedAbilities[index].POWER = e.target.valueAsNumber;
                                                        setAbilities(updatedAbilities);
                                                    }}
                                                    name={`ability-${index}-POWER`}
                                                    required
                                                    type="number"
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} md="3">
                                                <Form.Label>Element</Form.Label>
                                                <Select
                                                    onChange={handleSelectorChange}
                                                    options={elementsOptions}
                                                    name={`ability-${index}-ELEMENT`}
                                                    value={{ value: ability.ELEMENT, label: ability.ELEMENT }}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} md="3">
                                                <Form.Label>Duration</Form.Label>
                                                <Form.Control
                                                    value={ability.DURATION}
                                                    onChange={(e) => {
                                                        const updatedAbilities = [...abilities];
                                                        updatedAbilities[index].DURATION = e.target.valueAsNumber;
                                                        setAbilities(updatedAbilities);
                                                    }}
                                                    name={`ability-${index}-DURATION`}
                                                    required
                                                    type="number"
                                                />
                                            </Form.Group>
                                        </Form.Row>
                                        {abilities.length > 1 && (
                                            <Button
                                                variant="danger"
                                                onClick={() => {
                                                    const updatedAbilities = [...abilities];
                                                    updatedAbilities.splice(index, 1);
                                                    setAbilities(updatedAbilities);
                                                }}
                                            >
                                                Remove Ability
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {abilities.length < 3 && (
                                    <Button
                                        onClick={() => setAbilities([...abilities, { ABILITY: "", POWER: 0, ELEMENT: "", DURATION: 0 }])}
                                    >
                                        Add Ability
                                    </Button>
                                )}
                                
                                <Form.Row>
                                    <Form.Group as={Col} md="4">
                                        <Form.Label>Unlock Value</Form.Label>
                                        <Form.Control
                                            value={data.UNLOCK_METHOD.VALUE}
                                            onChange={onChangeHandler}
                                            name="unlock-value"
                                            required
                                            type="number"
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4">
                                        <Form.Label>Unlock Element</Form.Label>
                                        <Select
                                            onChange={handleSelectorChange}
                                            options={elementsOptions}
                                            name="unlock-element"
                                            value={{ value: data.UNLOCK_METHOD.ELEMENT, label: data.UNLOCK_METHOD.ELEMENT }}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="4">
                                        <Form.Label>Unlock Method</Form.Label>
                                        <Select
                                            onChange={handleSelectorChange}
                                            options={unlockMethodsOptions}
                                            name="unlock-method"
                                            value={{ value: data.UNLOCK_METHOD.METHOD, label: data.UNLOCK_METHOD.METHOD }}
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Button type="submit">Create Title</Button>
                                    <br />
                                    <br />
                                    {auth.user.data.IS_ADMIN ? 
                                    <Link to="/updatetitles"><Button variant="warning">Update Title</Button></Link> 
                                    : <span></span>
                                    }
                                    <br/>
                                    <br />
                                    {submission_alert_dom}
                            </Form>
                        </div>

                        <div>
                        <h2>Ability Titles and Explanations</h2>
                        <h6>If you want a title to be acquired as a starter make the Unlock Method Tales Runs and the Unlock Value 0</h6>
                        <ul>
                            {Object.entries(title_explanations).map(([title, explanation]) => (
                            <li key={title}>
                                <strong>{title}:</strong> {explanation}
                            </li>
                            ))}
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    titles: state.titles
})

export default connect(mapStateToProps, {saveTitle})(NewTitle)
