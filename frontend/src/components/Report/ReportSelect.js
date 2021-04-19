import React, {Component, useEffect, useState, useContext} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
//import WindowedSelect from "react-windowed-select";
// import 'react-select/dist/react-select.css'
// import 'react-virtualized/styles.css'
// import 'react-virtualized-select/styles.css'
import './report.css';
import {faCheckCircle, faEye, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
//import Select from 'react-select'
//import Select from 'react-select-virtualized';
//import VirtualizedSelect from 'react-virtualized-select'
import { WindowSelect } from 'react-window-select';
//import TokenList from "./TokenList";
import {AppContext} from "../../App";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function ReportSelect(props){
    const { reports, index, report,action } = useContext(AppContext);
    const [Reports,SetReports] = reports
    const [Action,SetAction] = action
    const [Index,SetIndex] = index
    const [Report,SetReport] = report
    const [Placeholder,SetPlaceholder] = useState('Select a report')
    const [IndexSel, SetIndexSel] = useState(0)
    const [ArrayBool,SetArrayBool] = useState([])
    const [Selected,SetSelected] = useState(0)
    const [option, setOption] = useState('')
    const options = [];
    Reports.map((report,index)=>{
        options.push({value: <span>{index+1} {ArrayBool[index] ? '':<FontAwesomeIcon icon={faTimesCircle} />}</span>, label: <span>{index+1} {ArrayBool[index] ? '':<FontAwesomeIcon icon={faTimesCircle} />}</span>  }   )
    })
    useEffect(()=>{
        console.log('ACTION',Action)
        if(Reports.length > 0 && Action !== ''){
            axios.get("http://examode.dei.unipd.it/exatag/get_reports_from_action", {params: {action:Action}}).then(response => {
                var array_annotated = response.data['reports_presence']
                console.log('arrayanno',array_annotated)
                var array_bool = []
                Reports.map(report=>{
                    var check = false
                    //var report = JSON.parse(report1)
                    array_annotated.map(element=>{

                        if(report['id_report'].toString() === element.toString()){
                            check = true
                        }
                    })
                    if(check === true){
                        array_bool.push(true)
                    }
                    else{
                        array_bool.push(false)
                    }
                })
                SetArrayBool(array_bool);
            })
        }
    },[Action,Reports,Report])

    const handleChange = (option) =>{
        console.log('option',props.value)
        console.log('value',option.value.props.children[0])
        //console.log('value',option.value)
        console.log('label',option.label)
        var val = Number(option.value.props.children[0])-1
        var index = (Number(val));
        SetIndex(Number(index))
        setOption({option})
        SetReport(Reports[Number(index)])
        SetSelected(option)
    }

    useEffect(()=>{
        // options.map((option,index)=>{
        //     if(index.toString()===Index.toString()){
        //         setOption('')
        //     }
        // })
        SetSelected('')
    },[Index])






    return (
            <span>

                    <WindowSelect className="select-custom-class"
                        isSearchable={false}
                                  isDisabled={false}
                        onChange={option => handleChange(option)}
                        options={options}
                        placeholder={Index+1}
                />
            </span>
    );


}
export default ReportSelect