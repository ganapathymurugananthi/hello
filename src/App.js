import './App.css';
import TodoList from './components/ToDoList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <TodoList />
      <ToastContainer />
    </div>
  );
}

export default App;
