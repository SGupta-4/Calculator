import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import {useReducer} from "react";
export const ACTION={
  ADD_DIGIT:"add-digit",
  CHOOSE_OPERATION:"choose-operation",
  CLEAR:"clear",
  DELETE_DIGIT:"delete-digit",
  EVALUATE:"evaluate"
}
function evaluate({currentOperand,previousOperand,operation}){
  const current = parseFloat(currentOperand)
  const prev = parseFloat(previousOperand)
  if(isNaN(current)||isNaN(prev)){
    return ""
  }
  let computation=""
  switch(operation){
    case "+":
      computation=prev + current
      break
    case "-":
      computation=prev - current
      break
    case "*":
      computation= prev * current
      break
    case "÷":
      computation= prev / current
      break      
  }
  return computation.toString()
}
const INTEGER_FORMATTER=new Intl.NumberFormat("en-us",{maximumFractionDigits:0,})
function formatDigit(operand){
  if(operand==null)return
  const[integer,decimal]=operand.split(".")
  if(decimal==null)return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
function reducer(state,{type,payload}){
  switch(type){
    case ACTION.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperand:payload.digit,
          overwrite:false
        }
      }
      if(payload.digit==="0" && state.currentOperand === "0"){return state}
      if(payload.digit==="." && state.currentOperand.includes(".")){
        return state
      }
      
      return {
        ...state,
        currentOperand:`${state.currentOperand||""}${payload.digit}`
      }
    case ACTION.CLEAR:
      return {}
    case ACTION.CHOOSE_OPERATION:
      if(state.currentOperand==null && state.previousOperand == null){
        return state
      }
      if(state.previousOperand == null){
        return{ 
        ...state,
        operation:payload.operation,
        previousOperand:state.currentOperand,
        currentOperand:null

        }

      }
      if(state.currentOperand == null){
        return{
          ...state,
          operation:payload.operation
        }
      }
      return{
        ...state,
        previousOperand:evaluate(state),
        operation:payload.operation,
        currentOperand:null,
      }
    case ACTION.EVALUATE:
      if(state.currentOperand==null || state.previousOperand==null || state.operation==null){
        return state
      }  
      return{
        ...state,
        overwrite:true,
        previousOperand:null,
        operation:null,
        currentOperand:evaluate(state),        
      }
    case ACTION.DELETE_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          overwrite:false,
          currentOperand:null,
        }
      }
      if(state.currentOperand==null){
        return state
      }
      if(state.currentOperand.length===1){
        return{
          ...state,
          currentOperand:null
        }
      }
      return{
        ...state,
        currentOperand:state.currentOperand.slice(0,-1)
      }

  }
}
function App() {
  const [{currentOperand,previousOperand,operation},dispatch]=useReducer(reducer,{})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatDigit(previousOperand)} {operation} </div>
        <div className="current-operand">{formatDigit(currentOperand)}</div>
        </div>
        <button className="span-two" onClick={()=>dispatch({type:ACTION.CLEAR})}>AC</button>
        <button onClick={()=>dispatch({type:ACTION.DELETE_DIGIT})}>DEL</button>
        <OperationButton operation={"÷"} dispatch={dispatch}/>
        <DigitButton digit={"1"} dispatch={dispatch}/>
        <DigitButton digit={"2"} dispatch={dispatch}/>
        <DigitButton digit={"3"} dispatch={dispatch}/>
        <OperationButton operation={"*"} dispatch={dispatch}/>
        <DigitButton digit={"4"} dispatch={dispatch}/>
        <DigitButton digit={"5"} dispatch={dispatch}/>
        <DigitButton digit={"6"} dispatch={dispatch}/>
        <OperationButton operation={"+"} dispatch={dispatch}/>
        <DigitButton digit={"7"} dispatch={dispatch}/>
        <DigitButton digit={"8"} dispatch={dispatch}/>
        <DigitButton digit={"9"} dispatch={dispatch}/>
        <OperationButton operation={"-"} dispatch={dispatch}/>
        <DigitButton digit={"."} dispatch={dispatch}/>
        <DigitButton digit={"0"} dispatch={dispatch}/>
        <button className="span-two" onClick={()=>dispatch({type:ACTION.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
