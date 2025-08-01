import React from 'react';

class ZoomErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger p-4">
          <h4>Failed to load Zoom meeting</h4>
          <p>
            Please try joining directly using this link: 
            <a href={this.props.zoomLink} target="_blank" rel="noreferrer">
              {this.props.zoomLink}
            </a>
          </p>
          <button 
            className="btn btn-secondary mt-2"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ZoomErrorBoundary;