import {IGreetingResponse} from "../intefaces/GreetingResponse.interface";

const greetWorld = (): IGreetingResponse => ({
  greeting: 'Hello World',
});

export default greetWorld;
