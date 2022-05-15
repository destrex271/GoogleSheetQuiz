import { useState } from "react";

const QuestionAns = ({question, options, corOption, incScore, getScore}) => {
    
    const [answered, setAnswered] = useState(false);
    const [ansCoutn, setAnsCount] = useState(0);
    const [finished, setFinished] = useState(false)
    
    const check = (option) => {
        if(option == corOption){
            incScore()
            setAnsCount(ansCoutn+1)
        }
        if(ansCoutn == 10){
            setFinished(true)
        }
        setAnswered(true)
    }
    if(finished){
        return <h1 className="display-1">Your score was {getScore()}/10 </h1>
    }
    if(!answered){
        return (
            <>
                <div className="qcont col-12 m-4 card">
                    <div className="card-body">
                        <div className="card-title question">
                            {question}
                        </div>
                        <ul className="card-text row sel">
                            {options.map((option)=>{
                            return <li className="option col-lg-2 col-md-2 col-sm-12 m-2"><button onClick={()=>check(option)} className="btn btn-outline-warning" >{option}</button></li> 
                            })}
                        </ul>
                    </div>
                </div>
            </>
        );
    }else{
        return null
    }
}
 
export default QuestionAns;