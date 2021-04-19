import React, {Component, useEffect, useState, useContext} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col} from "react-bootstrap";
import './report.css';
import {faCheckCircle, faEye, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {AppContext, MentionContext} from "../../App";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function ReportSelection(props){
    const { reportArray,reports,indexList,reportString, orderVar,index, report,action, save, insertionTimes } = useContext(AppContext);
    const [AnnotatedIndexList,SetAnnotatedIndexList] = indexList;
    const [OrderVar, SetOrderVar] = orderVar;
    const [Reports,SetReports] = reports
    const [ReportString,SetReportString] = reportString;
    const [Action,SetAction] = action
    const [Index,SetIndex] = index
    const [Report,SetReport] = report
    const [SavedGT,SetSavedGT] = save;
    const [IndexSel, SetIndexSel] = useState(0)
    const [ArrayBool,SetArrayBool] = useState([])
    const [ArrayInsertionTimes,SetArrayInsertionTimes] = insertionTimes;
    const [SelectOptions,SetSelectOptions] = reportArray;

    useEffect(()=>{
        console.log('ACTION',Action)
        console.log('Indice',Index)
        if(Reports.length > 0 && (Action === 'mentions' || Action === 'labels' || Action === 'concepts' || Action === 'concept-mention')){
            axios.get("http://examode.dei.unipd.it/exatag/get_reports_from_action", {params: {action:Action}}).then(response => {
                var array_annotated = response.data['reports_presence']
                //console.log('arrayanno',array_annotated)
                var array_bool = []
                var array_insert = []

                Reports.map(report=>{
                    var check = false
                    //var report = JSON.parse(report1)
                    array_annotated.map(element=>{
                        if(report['id_report'].toString() === element[0].toString()){
                            check = true
                            var date = element[1].split('T')
                            var hour = date[1].split('.')
                            var temp = 'date: ' + date[0] + '  time: '+ hour[0] + '(GMT+1)'
                            // console.log('temp',temp)
                            // console.log('temp',hour)
                            // console.log('temp',date)
                            array_insert.push(temp)

                        }
                    })
                    if(check === true){
                        array_bool.push(true)
                    }
                    else{
                        array_bool.push(false)
                        array_insert.push(0) // in questo caso non c'è groundtruth! Non ho nemmeno insertion date

                    }
                })
                SetArrayBool(array_bool);
                SetArrayInsertionTimes(array_insert);
            })
        }
        else{
            var array_bool = new Array(reports.length).fill(false)
            var array_insert = new Array(reports.length).fill(0)
            SetArrayBool(array_bool);
            SetArrayInsertionTimes(array_insert);

        }
    },[Action,Reports,SavedGT]) //C'era anche Index ma troppe chiamate

    const handleChange = (event) =>{
        var index = (event.target.value);
        //console.log('INDEX!!',(index))
        SetIndex(Number(index))
        SetReport(Reports[Number(index)])
    }

    useEffect(()=>{
        var arr_to_opt = []
        var new_arr_to_opt = []
        var already_ann = []
        var not_ann = []
        var index_list_ann = []
        var index_list_not_ann = []
        var index_list = []
        console.log('ordervar',OrderVar)
        {Reports.length>0 && ArrayBool.length>0 && Reports.map((report,ind)=>
            {
                if(ArrayBool[ind]){
                    arr_to_opt.push(<option value={ind} style={{'font-size':'0.8rem'}}>{ind+1}&nbsp;-&nbsp;{report.report_json.report_id}</option>)
                    already_ann.push(<option value={ind} style={{'font-size':'0.8rem'}}>{ind+1}&nbsp;-&nbsp;{report.report_json.report_id}</option>)
                    index_list_ann.push(ind)
                    // index_list_ann.push((ind,Reports[ind].id_report,Reports[ind].report_json))
                    // index_list_ann.push((ind,Reports[Index].id_report))

                }
                else{
                    arr_to_opt.push(<option value={ind} style={{'font-weight':'bold','font-size':'0.8rem'}}>{ind+1}&nbsp;-&nbsp;{report.report_json.report_id}</option>)
                    not_ann.push(<option value={ind} style={{'font-weight':'bold','font-size':'0.8rem'}}>{ind+1}&nbsp;-&nbsp;{report.report_json.report_id}</option>)
                    index_list_not_ann.push(ind)
                    // index_list_not_ann.push((ind,Reports[Index].id_report))
                    // index_list_not_ann.push((Reports[ind].id_report,Reports[ind].report_json))
                }
            }
        )}

        if(OrderVar === 'annotation'){
            new_arr_to_opt = [...not_ann,...already_ann]
            index_list = [...index_list_not_ann,...index_list_ann]
            SetSelectOptions(new_arr_to_opt)
            SetAnnotatedIndexList(index_list)
            // SetReports(index_list)

        }
        else{
            SetSelectOptions(arr_to_opt)
        }


    },[ArrayBool,OrderVar])

    return(


         <label>
             {SelectOptions &&

                  <select style={{'vertical-align':'bottom','font-size':'0.8rem'}} className='select_class'
                            value = {Index}
                          onChange={(e)=>handleChange(e)}>
                           options = {SelectOptions}


                  </select>}

        </label>

    );



}
export default ReportSelection