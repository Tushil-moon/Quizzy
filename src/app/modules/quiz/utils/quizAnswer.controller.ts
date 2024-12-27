import { Options, Questions } from "../models/quiz";

/**
 *  Handle checking answer
 * 
 * @param question current question details
 * @param selectedAnswer selected answer
 * @param correctAnswer correct answer
 * @returns resul
 */
export function checkAnswer (question:Questions,selectedAnswer:string | boolean | number, correctAnswer: Options | string | boolean):any{
    if(question.questionType === 'multiple-choice'){
        const selected = question.options.findIndex((option)=>option.isCorrect === true)
        const correctAnswer = question.options.find((option)=>option.isCorrect === true)
        if(selectedAnswer === selected){
            return {questionType:question,selectedAnswer:selectedAnswer,correctAnswer:correctAnswer,isSubmitted:true,isCorrect:true}
        }else{
            return {questionType:question,selectedAnswer:selectedAnswer,correctAnswer:correctAnswer,isSubmitted:true,isCorrect:false}
        }
    }else if(question.questionType === 'true-false'){
        if(selectedAnswer === correctAnswer){
            return {questionType:question,selectedAnswer:selectedAnswer,correctAnswer:correctAnswer,isSubmitted:true,isCorrect:true}
        }else{
            return {questionType:question,selectedAnswer:selectedAnswer,correctAnswer:correctAnswer,isSubmitted:true,isCorrect:false}
        }
    }else if(question.questionType === 'short-answer'){
        const selected = selectedAnswer.toString().toLowerCase().trim();
        const correct = correctAnswer.toString().toLowerCase().trim();
        if(selected === correct){
            return {questionType:question,selectedAnswer:selectedAnswer,correctAnswer:correctAnswer,isSubmitted:true,isCorrect:true}
        }else{
            return {questionType:question,selectedAnswer:selectedAnswer,correctAnswer:correctAnswer,isSubmitted:true,isCorrect:false}
        }
    }
}