import React, { useState, useEffect } from 'react'
import QuestionAns from './components/QuestionAns'
import axios from 'axios'

export default function App() {

	const [score, setScore] = useState(0);
	const [loadedm, setLoaded] = useState(false)
	const [questions, setQuestions] = useState([]);

	useEffect(()=>{
		const getQuiz = async() =>{
			axios.get('http://localhost:5000/quiz')
			.then((res)=>{
				setQuestions(res.data)
			})
		}
		getQuiz()
		setLoaded(true)
	},[]);

	const incScore = () =>{ 
		setScore(score+1)
		console.log(score)
	}
 

	return (
		<div className='App'>
			<h1>Score is {score}</h1>
			{loadedm && questions.map((question)=>{
				console.log(question.question)
				return <QuestionAns question={question.question} options={question.options} corOption={question.correctOption} incScore={incScore} />
			})}
		</div>
	)
}
