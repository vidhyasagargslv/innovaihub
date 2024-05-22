import  { Component }  from 'react'

class Error extends Component {
    constructor(props){
        super(props)
        this.state = {
            hasError: false
        };
    }

    componentDidCatch(error, errorInfo) {
        // You can log the error or send it to an error reporting service
        console.error('Error caught in ErrorBoundary:', error, errorInfo);
    
        // Display a fallback UI
        this.setState({ hasError: true });
      }
    
      render() {
        if (this.state.hasError) {
          // Fallback UI
          return <h1>Something went wrong.</h1>;
        }
    
        return this.props.children;
      }
    }

export default Error