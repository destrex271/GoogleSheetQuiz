import { useState } from "react";

const QuestionAns = ({question, options, corOption, incScore}) => {
    
    const [answered, setAnswered] = useState(false);
    
    const check = (option) => {
        setAnswered(true)
        if(option == corOption){incScore()}
    }
    if(!answered){
        return (
            <>
                <div className="question">
                    {question}
                </div>
                <ul>
                    {options.map((option)=>{
                    return <li className="option"><button onClick={()=>check(option)}>{option}</button></li> 
                    })}
                </ul>
            </>
        );
    }else{
        return null
    }
}
 
export default QuestionAns;