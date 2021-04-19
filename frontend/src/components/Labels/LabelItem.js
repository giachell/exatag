import React, {useContext} from 'react'
import {Container,Row,Col} from "react-bootstrap";
import './labels.css';
import { useState, useEffect } from "react";
import {AppContext} from "../../App";



function LabelItem(props) {
    const { radio,disButton,labelsToInsert,checks,labelsList,clickedCheck } = useContext(AppContext);
    const [labels,setLabels] = labelsList;
    const [ClickedCheck, SetClickedCheck] = clickedCheck;
    const [Disable_Buttons, SetDisable_Buttons] = disButton;
    const [Checks,SetChecks] = checks;
    const [checked, setChecked] = useState(false)
    //const [checked, setChecked] = useState('')
    const [RadioChecked, SetRadioChecked] = radio;
    const [LabToInsert,SetLabToInsert] = labelsToInsert;
    useEffect(()=>{

        setChecked(props.checks[props.seq_number-1])
    },[props.checks]);

    useEffect(()=>{
        var item = {'label':props.label,'seq_number':props.seq_number}
        // console.log('item:',item)
        // console.log('item:',checked)
        // console.log('item:',LabToInsert)

        if(checked === true){
            //console.log('qua')

            SetRadioChecked(true)
            var array = LabToInsert
            var equal = false
            LabToInsert.map(lab=>{
                //console.log('item1:',lab.seq_number)
                //console.log('item1:',props.seq_number)

                if(lab.seq_number === props.seq_number){
                    equal = true
                }
            })
            if(equal === false){
                array.push(item)
                SetLabToInsert(array)
            }
            //console.log('qua',array)


        }
        else{
            //console.log('qua3')
            var array = LabToInsert
            array = array.filter(item => item.seq_number !== props.seq_number)
            //SetClickedCheck(true)
            //console.log('qua3',array)

            // LabToInsert.map(lab => {
            //     if(lab.seq_number === props.seq_number){
            //         console.log('qua1')
            //         array = array.filter(item => item.seq_number !== props.seq_number)
            //
            //         console.log('qua3',array)
            //
            //     }
            // })
            SetLabToInsert(array)




        }
    },[checked])

    useEffect(()=>{
        //console.log('labs',LabToInsert)
        var user_ch = new Array(labels.length).fill(false)
        if(LabToInsert.length>0){

            SetRadioChecked(true)

            LabToInsert.map(lab => {
                user_ch[lab.seq_number - 1] = true
            })
            SetChecks(user_ch) //Una volta era sotto, in caso decommento
        }

        else{
            SetRadioChecked(false)

        }

        // SetChecks(user_ch)
    },[LabToInsert])



    return (



                    <div className="labelitem">

                {/*<input type="checkbox" value={props.label}/>*/}
                {/*<p key={props.seq_number}>{props.seq_number}: {props.label}</p>*/}
                        <input
                            name="labels"
                            type="checkbox"
                            value={props.label}
                            checked={checked}
                            onChange={()=> {setChecked(checked => !checked);SetClickedCheck(true);SetDisable_Buttons(false)}}
                        />
                        <a className='buttlabel' onClick={()=> {setChecked(checked => !checked);SetClickedCheck(true);SetDisable_Buttons(false)}}>
                           <label className='item_lab'>&nbsp;{props.label}
                                {/*{props.seq_number}: {props.label}*/}

                </label>
                </a>
</div>




        );
    }






export default LabelItem



// const LabelItem =(props) => {
//
//         return (
//             <div className="labelitem">
//                     {/*<input type="checkbox" value={props.label}/>*/}
//                     {/*<p key={props.seq_number}>{props.seq_number}: {props.label}</p>*/}
//                     <input
//                         name="labels"
//                         type="checkbox"
//                         value={props.label}
//                         checked=''
//                         onChange={handleChange}
//                     />
//                     <label>
//                             {props.seq_number}: {props.label}
//                     </label>
//             </div>
//         );
//
//
//
// }
// export default LabelItem
